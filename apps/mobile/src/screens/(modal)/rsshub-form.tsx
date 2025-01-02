import type { RSSHubParameter, RSSHubParameterObject, RSSHubRoute } from "@follow/models/src/rsshub"
import { parseFullPathParams, parseRegexpPathParams } from "@follow/utils"
import { PortalProvider } from "@gorhom/portal"
import { zodResolver } from "@hookform/resolvers/zod"
import { router, Stack, useLocalSearchParams } from "expo-router"
import { useEffect, useMemo } from "react"
import type { UseFormReturn } from "react-hook-form"
import { useForm } from "react-hook-form"
import { Linking, Text, TouchableOpacity, View } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-controller"
import { z } from "zod"

import { ModalHeaderCloseButton } from "@/src/components/common/ModalSharedComponents"
import { FormLabel } from "@/src/components/ui/form/Label"
import { Select } from "@/src/components/ui/form/Select"
import { TextField } from "@/src/components/ui/form/TextField"
import MarkdownWeb from "@/src/components/ui/typography/MarkdownWeb"
import { PreviewUrl } from "@/src/modules/rsshub/preview-url"

interface RsshubFormParams {
  route: RSSHubRoute
  routePrefix: string
  name: string
}
export default function RsshubForm() {
  const params = useLocalSearchParams()

  const { route, routePrefix, name } = (params || {}) as Record<string, string>

  const parsedRoute = useMemo(() => {
    if (!route) return null
    try {
      return typeof route === "string" ? JSON.parse(route) : route
    } catch {
      return null
    }
  }, [route])

  const canBack = router.canDismiss()
  useEffect(() => {
    if (!parsedRoute && canBack) {
      router.dismiss()
    }
  }, [canBack, parsedRoute])
  if (!parsedRoute || !routePrefix) {
    return null
  }
  return <FormImpl route={parsedRoute} routePrefix={routePrefix as string} name={name} />
}

function FormImpl({ route, routePrefix, name }: RsshubFormParams) {
  const { name: routeName } = route
  const keys = useMemo(
    () =>
      parseRegexpPathParams(route.path, {
        excludeNames: [
          "routeParams",
          "functionalFlag",
          "fulltext",
          "disableEmbed",
          "date",
          "language",
          "lang",
          "sort",
        ],
      }),
    [route.path],
  )

  const formPlaceholder = useMemo<Record<string, string>>(() => {
    if (!route.example) return {}
    return parseFullPathParams(route.example.replace(`/${routePrefix}`, ""), route.path)
  }, [route.example, route.path, routePrefix])
  const dynamicFormSchema = useMemo(
    () =>
      z.object({
        ...Object.fromEntries(
          keys.map((keyItem) => [
            keyItem.name,
            keyItem.optional ? z.string().optional().nullable() : z.string().min(1),
          ]),
        ),
      }),
    [keys],
  )

  const defaultValue = useMemo(() => {
    const ret = {} as Record<string, string | null>
    if (!route.parameters) return ret
    for (const key in route.parameters) {
      const params = normalizeRSSHubParameters(route.parameters[key])
      if (!params) continue
      ret[key] = params.default
    }
    return ret
  }, [route.parameters])

  const form = useForm<z.infer<typeof dynamicFormSchema>>({
    resolver: zodResolver(dynamicFormSchema),
    defaultValues: defaultValue,
    mode: "all",
  }) as UseFormReturn<any>

  return (
    <PortalProvider>
      <KeyboardAwareScrollView className="bg-system-grouped-background">
        <Stack.Screen
          options={{ headerLeft: ModalHeaderCloseButton, headerTitle: `${name} - ${routeName}` }}
        />

        <PreviewUrl
          className="m-2 mb-6"
          watch={form.watch}
          path={route.path}
          routePrefix={routePrefix}
        />
        {/* Form */}

        <View className="bg-system-grouped-background-2 mx-2 gap-4 rounded-lg px-3 py-6">
          {keys.map((keyItem) => {
            const parameters = normalizeRSSHubParameters(route.parameters[keyItem.name])
            const formRegister = form.register(keyItem.name)

            return (
              <View key={keyItem.name}>
                <FormLabel className="pl-1" label={keyItem.name} optional={keyItem.optional} />
                {!parameters?.options && (
                  <TextField
                    wrapperClassName="mt-2"
                    placeholder={formPlaceholder[keyItem.name]}
                    value={form.getValues(keyItem.name)}
                    onChangeText={(text) => {
                      formRegister.onChange({
                        target: { value: text },
                      })
                    }}
                  />
                )}

                {!!parameters?.options && (
                  <Select
                    wrapperClassName="mt-2"
                    options={parameters.options}
                    value={form.getValues(keyItem.name)}
                    onValueChange={(value) => {
                      formRegister.onChange({ target: { value } })
                    }}
                  />
                )}

                {!!parameters && (
                  <Text className="text-text/80 ml-2 mt-2 text-xs">{parameters.description}</Text>
                )}
              </View>
            )
          })}
        </View>
        <Maintainers maintainers={route.maintainers} />

        <View className="mx-4 mt-4">
          <MarkdownWeb value={route.description} dom={{ matchContents: true }} />
        </View>
      </KeyboardAwareScrollView>
    </PortalProvider>
  )
}

const Maintainers = ({ maintainers }: { maintainers?: string[] }) => {
  if (!maintainers || maintainers.length === 0) {
    return null
  }

  return (
    <View className="text-text/80 mx-4 mt-2 flex flex-row flex-wrap gap-x-1 text-sm">
      <Text className="text-text/80 text-xs">This feed is provided by RSSHub, with credit to </Text>
      {maintainers.map((m) => (
        <TouchableOpacity key={m} onPress={() => Linking.openURL(`https://github.com/${m}`)}>
          <Text className="text-text/50 text-xs">@{m}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const normalizeRSSHubParameters = (parameters: RSSHubParameter): RSSHubParameterObject | null =>
  parameters
    ? typeof parameters === "string"
      ? { description: parameters, default: null }
      : parameters
    : null

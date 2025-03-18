import type { RSSHubParameter, RSSHubParameterObject, RSSHubRoute } from "@follow/models/src/rsshub"
import {
  MissingOptionalParamError,
  parseFullPathParams,
  parseRegexpPathParams,
  regexpPathToPath,
} from "@follow/utils"
import { PortalProvider } from "@gorhom/portal"
import { zodResolver } from "@hookform/resolvers/zod"
import { memo, useEffect, useMemo, useState } from "react"
import type { FieldErrors } from "react-hook-form"
import { Controller, useForm } from "react-hook-form"
import { KeyboardAvoidingView, Linking, Text, TouchableOpacity, View } from "react-native"
import { z } from "zod"

import { ModalHeaderSubmitButton } from "@/src/components/common/ModalSharedComponents"
import { SafeModalScrollView } from "@/src/components/layouts/views/SafeModalScrollView"
import {
  NavigationBlurEffectHeader,
  SafeNavigationScrollView,
} from "@/src/components/layouts/views/SafeNavigationScrollView"
import { FormProvider, useFormContext } from "@/src/components/ui/form/FormProvider"
import { Select } from "@/src/components/ui/form/Select"
import { TextField } from "@/src/components/ui/form/TextField"
import { Markdown } from "@/src/components/ui/typography/Markdown"
import { useNavigation } from "@/src/lib/navigation/NavigationInstanceContext"
import {
  useSetModalScreenOptions,
  useSetScreenOptions,
} from "@/src/lib/navigation/ScreenOptionsContext"
import type { NavigationControllerView } from "@/src/lib/navigation/types"
import { toast } from "@/src/lib/toast"
import { feedSyncServices } from "@/src/store/feed/store"

import { FollowScreen } from "./follow"

interface RsshubFormParams {
  route: RSSHubRoute
  routePrefix: string
  name: string
}

export const RsshubFormScreen: NavigationControllerView<RsshubFormParams> = ({
  route,
  routePrefix,
  name,
}) => {
  const parsedRoute = useMemo(() => {
    if (!route) return null
    try {
      return typeof route === "string" ? JSON.parse(route) : route
    } catch {
      return null
    }
  }, [route])

  const navigation = useNavigation()
  const canBack = navigation.canGoBack()
  useEffect(() => {
    if (!parsedRoute && canBack) {
      navigation.back()
    }
  }, [canBack, navigation, parsedRoute])
  if (!parsedRoute || !routePrefix) {
    return null
  }
  return <FormImpl route={parsedRoute} routePrefix={routePrefix as string} name={name!} />
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
      const params = normalizeRSSHubParameters(route.parameters[key]!)
      if (!params) continue
      ret[key] = params.default
    }
    return ret
  }, [route.parameters])

  const form = useForm<z.infer<typeof dynamicFormSchema>>({
    resolver: zodResolver(dynamicFormSchema),
    defaultValues: defaultValue,
    mode: "all",
  })

  // eslint-disable-next-line unicorn/prefer-structured-clone
  const nextErrors = JSON.parse(JSON.stringify(form.formState.errors))

  return (
    <FormProvider form={form}>
      <PortalProvider>
        <KeyboardAvoidingView className="flex-1" behavior="padding">
          <SafeNavigationScrollView className="bg-system-grouped-background">
            <ScreenOptions
              name={name}
              routeName={routeName}
              route={route.path}
              routePrefix={routePrefix}
              errors={nextErrors}
            />
            {keys.length === 0 && (
              <View className="bg-secondary-system-grouped-background mx-2 mt-2 gap-4 rounded-lg p-3">
                <Text className="text-center text-base">This feed has no parameters.</Text>
              </View>
            )}
            {keys.length > 0 && (
              <View className="bg-secondary-system-grouped-background mx-2 mt-2 gap-4 rounded-lg px-3 py-6">
                {keys.map((keyItem) => {
                  const parameters = normalizeRSSHubParameters(route.parameters[keyItem.name]!)

                  return (
                    <View key={keyItem.name}>
                      {!parameters?.options && (
                        <Controller
                          name={keyItem.name}
                          control={form.control}
                          rules={{
                            required: !keyItem.optional,
                            // validate: (value) => {
                            //   return dynamicFormSchema.safeParse({
                            //     [keyItem.name]: value,
                            //   }).success
                            // },
                          }}
                          render={({ field: { onChange, onBlur, ref, value } }) => (
                            <KeyboardAvoidingView behavior="padding">
                              <TextField
                                label={keyItem.name}
                                required={!keyItem.optional}
                                wrapperClassName="mt-2"
                                placeholder={formPlaceholder[keyItem.name]}
                                onBlur={onBlur}
                                onChangeText={onChange}
                                defaultValue={defaultValue[keyItem.name] ?? ""}
                                value={value ?? ""}
                                ref={ref}
                              />
                            </KeyboardAvoidingView>
                          )}
                        />
                      )}

                      {!!parameters?.options && (
                        <Controller
                          name={keyItem.name}
                          control={form.control}
                          render={({ field: { onChange, value } }) => (
                            <Select
                              label={keyItem.name}
                              options={parameters.options ?? []}
                              value={value}
                              onValueChange={onChange}
                            />
                          )}
                        />
                      )}

                      {!!parameters && (
                        <Text className="text-secondary-label ml-2 mt-1 text-xs">
                          {parameters.description}
                        </Text>
                      )}
                    </View>
                  )
                })}
              </View>
            )}
            <Maintainers maintainers={route.maintainers} />

            {!!route.description && (
              <View className="bg-system-background border-t-hairline border-opaque-separator mt-4 flex-1 px-4">
                <Markdown
                  className="bg-system-background py-4"
                  value={route.description.replaceAll("::: ", ":::")}
                  webViewProps={{ matchContents: true, scrollEnabled: false }}
                />
              </View>
            )}
          </SafeNavigationScrollView>
        </KeyboardAvoidingView>
      </PortalProvider>
    </FormProvider>
  )
}

const Maintainers = ({ maintainers }: { maintainers?: string[] }) => {
  if (!maintainers || maintainers.length === 0) {
    return null
  }

  return (
    <View className="text-tertiary-label mx-4 mt-2 flex flex-row flex-wrap gap-x-1 text-sm">
      <Text className="text-secondary-label text-xs">
        This feed is provided by RSSHub, with credit to{" "}
      </Text>
      {maintainers.map((m) => (
        <TouchableOpacity key={m} onPress={() => Linking.openURL(`https://github.com/${m}`)}>
          <Text className="text-accent/90 text-xs">@{m}</Text>
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

type ScreenOptionsProps = {
  name: string
  routeName: string
  route: string
  routePrefix: string
  errors: FieldErrors
}
const ScreenOptions = memo(
  ({ name, routeName, route, routePrefix, errors }: ScreenOptionsProps) => {
    const form = useFormContext()

    const setScreenOptions = useSetModalScreenOptions()
    useEffect(() => {
      setScreenOptions({
        preventNativeDismiss: form.formState.isDirty,
        gestureEnabled: !form.formState.isDirty,
      })
    }, [form.formState.isDirty, setScreenOptions])
    return (
      <NavigationBlurEffectHeader
        title={`${name} - ${routeName}`}
        headerRight={
          <FormProvider form={form}>
            <ModalHeaderSubmitButtonImpl errors={errors} routePrefix={routePrefix} route={route} />
          </FormProvider>
        }
      />
    )
  },
)

const routeParamsKeyPrefix = "route-params-"

const ModalHeaderSubmitButtonImpl = ({
  routePrefix,
  route,
  errors,
}: {
  routePrefix: string
  route: string
  errors: FieldErrors
}) => {
  const form = useFormContext()
  const isValid = Object.keys(errors).length === 0

  const navigation = useNavigation()
  const [isLoading, setIsLoading] = useState(false)

  const submit = form.handleSubmit((_data) => {
    setIsLoading(true)
    const data = Object.fromEntries(
      Object.entries(_data).filter(([key]) => !key.startsWith(routeParamsKeyPrefix)),
    )

    try {
      const routeParamsPath = encodeURIComponent(
        Object.entries(_data)
          .filter(([key, value]) => key.startsWith(routeParamsKeyPrefix) && value)
          .map(([key, value]) => [key.slice(routeParamsKeyPrefix.length), value])
          .map(([key, value]) => `${key}=${value}`)
          .join("&"),
      )

      const fillRegexpPath = regexpPathToPath(
        routeParamsPath ? route.slice(0, route.indexOf("/:routeParams")) : route,
        data,
      )
      const url = `rsshub://${routePrefix}${fillRegexpPath}`

      const finalUrl = routeParamsPath ? `${url}/${routeParamsPath}` : url

      feedSyncServices
        .fetchFeedById({ url: finalUrl })
        .then((feed) => {
          navigation.pushControllerView(FollowScreen, {
            id: feed?.id,
            type: "url" as const,
            url: finalUrl,
          })
        })
        .catch(() => {
          toast.error("Failed to fetch feed")
        })
        .finally(() => {
          setIsLoading(false)
        })
    } catch (err: unknown) {
      if (err instanceof MissingOptionalParamError) {
        toast.error(err.message)
        // const idx = keys.findIndex((item) => item.name === err.param)
        // form.setFocus(keys[idx === 0 ? 0 : idx - 1].name, {
        //   shouldSelect: true,
        // })
      }
    }
  })

  return <ModalHeaderSubmitButton isLoading={isLoading} isValid={isValid} onPress={submit} />
}

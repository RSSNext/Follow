import { FeedViewType } from "@follow/constants"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { Stack } from "expo-router"
import { Controller, useForm } from "react-hook-form"
import { Alert, ScrollView, Text, View } from "react-native"
import { z } from "zod"

import {
  ModalHeaderCloseButton,
  ModalHeaderShubmitButton,
} from "@/src/components/common/ModalSharedComponents"
import { FormProvider } from "@/src/components/ui/form/FormProvider"
import { FormLabel } from "@/src/components/ui/form/Label"
import { FormSwitch } from "@/src/components/ui/form/Switch"
import { TextField } from "@/src/components/ui/form/TextField"
import { IconWithFallback } from "@/src/components/ui/icon/fallback-icon"
import { LoadingIndicator } from "@/src/components/ui/loading"
import { useList } from "@/src/store/list/hooks"
import { listSyncServices } from "@/src/store/list/store"
import { useSubscriptionByListId } from "@/src/store/subscription/hooks"

import { FeedViewSelector } from "../feed/view-selector"

export const FollowList = (props: { id: string }) => {
  const { id } = props
  const list = useList(id as string)
  const { isLoading } = useQuery({
    queryKey: ["list", id],
    queryFn: () => listSyncServices.fetchListById({ id: id as string }),
    enabled: !list,
  })

  if (isLoading) {
    return (
      <View className="mt-24 flex-1 flex-row items-start justify-center">
        <LoadingIndicator size={36} />
      </View>
    )
  }

  return <Impl id={id} />
}

const formSchema = z.object({
  view: z.string(),
  isPrivate: z.boolean().optional(),
  title: z.string().optional(),
})
const defaultValues = { view: FeedViewType.Articles.toString() }

const Impl = (props: { id: string }) => {
  const { id } = props
  const list = useList(id as string)!

  const isSubscribed = useSubscriptionByListId(id as string)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })
  const { isValid, isDirty } = form.formState

  const submit = async () => {
    const payload = form.getValues()
    // console.log("submit", payload)
    void payload

    if (list.fee && !isSubscribed) {
      Alert.alert(
        `To follow this list, you must pay a fee to the list creator. Press OK to pay ${list.fee} power to follow this list.`,
        "OK",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "OK",
            onPress: () => {},
          },
        ],
      )
    }
  }

  const isLoading = false

  return (
    <ScrollView contentContainerClassName="px-2 pt-4 gap-y-4">
      <Stack.Screen
        options={{
          title: `${isSubscribed ? "Edit" : "Follow"} - ${list?.title}`,
          headerLeft: ModalHeaderCloseButton,
          gestureEnabled: !isDirty,
          headerRight: () => (
            <ModalHeaderShubmitButton
              isValid={isValid}
              onPress={form.handleSubmit(submit)}
              isLoading={isLoading}
            />
          ),
        }}
      />

      <View className="bg-secondary-system-grouped-background rounded-lg p-4">
        <View className="flex flex-row gap-4">
          <View className="size-[50px] overflow-hidden rounded-lg">
            <IconWithFallback url={list?.image} size={50} />
          </View>
          <View className="flex-1 flex-col gap-y-1">
            <Text className="text-text text-lg font-semibold">{list?.title}</Text>
            <Text className="text-secondary-label text-sm">{list?.description}</Text>
          </View>
        </View>
      </View>

      <View className="bg-secondary-system-grouped-background gap-y-4 rounded-lg p-4">
        <FormProvider form={form}>
          <View className="-mx-4">
            <FormLabel className="mb-4 pl-5" label="View" optional />

            <FeedViewSelector value={list.view} />
          </View>

          <View>
            <Controller
              name="title"
              control={form.control}
              render={({ field: { onChange, ref, value } }) => (
                <TextField
                  label="Title"
                  description="Custom title for this Feed. Leave empty to use the default."
                  onChangeText={onChange}
                  value={value}
                  ref={ref}
                />
              )}
            />
          </View>

          <View>
            <Controller
              name="isPrivate"
              control={form.control}
              render={({ field: { onChange, value } }) => (
                <FormSwitch
                  value={value}
                  label="Private"
                  description="Private feeds are only visible to you."
                  onValueChange={onChange}
                />
              )}
            />
          </View>

          {!!list.fee && (
            <View>
              <View className="flex-row">
                <FormLabel label="Follow fee" optional />
                <Text className="text-text text-lg font-semibold">{list.fee}</Text>
              </View>
              <Text className="text-secondary-label text-sm">
                To follow this list, you must pay a fee to the list creator.
              </Text>
            </View>
          )}
        </FormProvider>
      </View>
    </ScrollView>
  )
}

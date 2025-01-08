import { FeedViewType } from "@follow/constants"
import { zodResolver } from "@hookform/resolvers/zod"
import { router, Stack, useLocalSearchParams } from "expo-router"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { ScrollView, Text, View } from "react-native"
import { z } from "zod"

import {
  ModalHeaderCloseButton,
  ModalHeaderShubmitButton,
} from "@/src/components/common/ModalSharedComponents"
import { FormProvider } from "@/src/components/ui/form/FormProvider"
import { FormLabel } from "@/src/components/ui/form/Label"
import { FormSwitch } from "@/src/components/ui/form/Switch"
import { TextField } from "@/src/components/ui/form/TextField"
import { FeedIcon } from "@/src/components/ui/icon/feed-icon"
import { FeedViewSelector } from "@/src/modules/feed/view-selector"
import { useFeed } from "@/src/store/feed/hooks"
import { subscriptionSyncService } from "@/src/store/subscription/store"
import type { SubscriptionForm } from "@/src/store/subscription/types"

const formSchema = z.object({
  view: z.string(),
  category: z.string().nullable().optional(),
  isPrivate: z.boolean().optional(),
  title: z.string().optional(),
})
const defaultValues = { view: FeedViewType.Articles.toString() }

export default function Follow() {
  const { id } = useLocalSearchParams()

  const feed = useFeed(id as string)
  // const hasSub = useSubscriptionByFeedId(feed?.id || "")
  // const isSubscribed = !!feedQuery.data?.subscription || hasSub

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const [isLoading, setIsLoading] = useState(false)
  const submit = async () => {
    setIsLoading(true)
    const values = form.getValues()
    const body: SubscriptionForm = {
      url: feed.url,
      view: Number.parseInt(values.view),
      category: values.category ?? "",
      isPrivate: values.isPrivate ?? false,
      title: values.title ?? "",
      feedId: feed.id,
    }

    await subscriptionSyncService.subscribe(body).finally(() => {
      setIsLoading(false)
    })

    if (router.canDismiss()) {
      router.dismissAll()
    }
  }

  const { isValid, isDirty } = form.formState

  return (
    <ScrollView contentContainerClassName="px-2 pt-4 gap-y-4">
      <Stack.Screen
        options={{
          title: `Follow - ${feed?.title}`,
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

      {/* Group 1 */}
      <View className="bg-system-grouped-background-2 rounded-lg p-4">
        <View className="flex flex-row gap-4">
          <View className="size-[50px] overflow-hidden rounded-lg">
            <FeedIcon feed={feed} size={50} />
          </View>
          <View className="flex-1 flex-col gap-y-1">
            <Text className="text-text text-lg font-semibold">{feed?.title}</Text>
            <Text className="text-system-secondary-label text-secondary-text text-sm">
              {feed?.description}
            </Text>
          </View>
        </View>
      </View>
      {/* Group 2 */}
      <View className="bg-system-grouped-background-2 gap-y-4 rounded-lg p-4">
        <FormProvider form={form}>
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
              name="category"
              control={form.control}
              render={({ field: { onChange, ref, value } }) => (
                <TextField
                  label="Category"
                  description="By default, your follows will be grouped by website."
                  onChangeText={onChange}
                  value={value || ""}
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

          <View className="-mx-4">
            <FormLabel className="mb-4 pl-5" label="View" optional />

            <Controller
              name="view"
              control={form.control}
              render={({ field: { onChange, value } }) => (
                <FeedViewSelector value={value as any as FeedViewType} onChange={onChange} />
              )}
            />
          </View>
        </FormProvider>
      </View>
    </ScrollView>
  )
}

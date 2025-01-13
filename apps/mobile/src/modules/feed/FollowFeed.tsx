import { FeedViewType } from "@follow/constants"
import { zodResolver } from "@hookform/resolvers/zod"
import { StackActions } from "@react-navigation/native"
import { useQuery } from "@tanstack/react-query"
import { router, Stack, useLocalSearchParams, useNavigation } from "expo-router"
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
import { LoadingIndicator } from "@/src/components/ui/loading"
import { useIsRouteOnlyOne } from "@/src/hooks/useIsRouteOnlyOne"
import { FeedViewSelector } from "@/src/modules/feed/view-selector"
import { useFeed } from "@/src/store/feed/hooks"
import { feedSyncServices } from "@/src/store/feed/store"
import { useSubscriptionByFeedId } from "@/src/store/subscription/hooks"
import { subscriptionSyncService } from "@/src/store/subscription/store"
import type { SubscriptionForm } from "@/src/store/subscription/types"

const formSchema = z.object({
  view: z.string(),
  category: z.string().nullable().optional(),
  isPrivate: z.boolean().optional(),
  title: z.string().optional(),
})
const defaultValues = { view: FeedViewType.Articles.toString() }
export function FollowFeed(props: { id: string }) {
  const { id } = props
  const feed = useFeed(id as string)
  const { isLoading } = useQuery({
    queryKey: ["feed", id],
    queryFn: () => feedSyncServices.fetchFeedById({ id: id as string }),
    enabled: !feed,
  })

  if (isLoading) {
    return (
      <View className="mt-24 flex-1 flex-row items-start justify-center">
        <LoadingIndicator size={36} />
      </View>
    )
  }

  return <FollowImpl />
}
function FollowImpl() {
  const { id } = useLocalSearchParams()

  const feed = useFeed(id as string)
  const isSubscribed = useSubscriptionByFeedId(feed?.id || "")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const [isLoading, setIsLoading] = useState(false)
  const routeOnlyOne = useIsRouteOnlyOne()
  const navigate = useNavigation()
  const parentRoute = navigate.getParent()
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

      if (!routeOnlyOne) {
        parentRoute?.dispatch(StackActions.popToTop())
      }
    }
  }

  const { isValid, isDirty } = form.formState

  if (!feed?.id) {
    return <Text className="text-text">Feed ({id}) not found</Text>
  }

  return (
    <ScrollView contentContainerClassName="px-2 pt-4 gap-y-4">
      <Stack.Screen
        options={{
          title: `${isSubscribed ? "Edit" : "Follow"} - ${feed?.title}`,
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
      <View className="bg-secondary-system-grouped-background rounded-lg p-4">
        <View className="flex flex-row gap-4">
          <View className="size-[50px] overflow-hidden rounded-lg">
            <FeedIcon feed={feed} size={50} />
          </View>
          <View className="flex-1 flex-col gap-y-1">
            <Text className="text-text text-lg font-semibold">{feed?.title}</Text>
            <Text className="text-secondary-label text-sm">{feed?.description}</Text>
          </View>
        </View>
      </View>
      {/* Group 2 */}
      <View className="bg-secondary-system-grouped-background gap-y-4 rounded-lg p-4">
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

import { FeedViewType } from "@follow/constants"
import { zodResolver } from "@hookform/resolvers/zod"
import { Stack, useLocalSearchParams } from "expo-router"
import { Controller, useForm } from "react-hook-form"
import { ScrollView, Text, View } from "react-native"
import { z } from "zod"

import { ModalHeaderCloseButton } from "@/src/components/common/ModalSharedComponents"
import { FormProvider } from "@/src/components/ui/form/FormProvider"
import { FormSwitch } from "@/src/components/ui/form/Switch"
import { TextField } from "@/src/components/ui/form/TextField"
import { FeedIcon } from "@/src/components/ui/icon/feed-icon"
import { useFeed } from "@/src/store/feed/hooks"

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

  return (
    <ScrollView contentContainerClassName="px-2 pt-4 gap-y-4">
      <Stack.Screen
        options={{
          title: `Follow - ${feed?.title}`,
          headerLeft: ModalHeaderCloseButton,
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
        </FormProvider>
      </View>
    </ScrollView>
  )
}

import { FeedViewType } from "@follow/constants"
import { zodResolver } from "@hookform/resolvers/zod"
import { Stack, useLocalSearchParams } from "expo-router"
import { memo } from "react"
import { Controller, useForm } from "react-hook-form"
import { View } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-controller"
import { z } from "zod"

import {
  ModalHeaderCloseButton,
  ModalHeaderSubmitButton,
} from "@/src/components/common/ModalSharedComponents"
import { FormProvider, useFormContext } from "@/src/components/ui/form/FormProvider"
import { FormLabel } from "@/src/components/ui/form/Label"
import { NumberField, TextField } from "@/src/components/ui/form/TextField"
import { GroupedInsetListCard } from "@/src/components/ui/grouped/GroupedList"
import { PowerIcon } from "@/src/icons/power"
import { FeedViewSelector } from "@/src/modules/feed/view-selector"
import { useList } from "@/src/store/list/hooks"
import { accentColor } from "@/src/theme/colors"

const listSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  image: z.string().url(),
  fee: z.number().min(0),
  view: z.nativeEnum(FeedViewType),
})
export default function ListScreen() {
  const listId = useLocalSearchParams<{ id?: string }>().id

  const list = useList(listId || "")
  const form = useForm({
    defaultValues: list,
    resolver: zodResolver(listSchema),
    mode: "all",
  })
  return (
    <FormProvider form={form}>
      <KeyboardAwareScrollView className="bg-system-grouped-background flex-1 pb-safe">
        <ScreenOptions title={list?.title} />

        <GroupedInsetListCard showSeparator={false} className="mt-6 px-3 py-6">
          <Controller
            name="title"
            control={form.control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, ref, value } }) => (
              <TextField
                label="Title"
                required={true}
                wrapperClassName="mt-2"
                placeholder=""
                onBlur={onBlur}
                onChangeText={onChange}
                defaultValue={list?.title ?? ""}
                value={value ?? ""}
                ref={ref}
              />
            )}
          />

          <View className="mt-4">
            <Controller
              name="description"
              control={form.control}
              render={({ field: { onChange, onBlur, ref, value } }) => (
                <TextField
                  label="Description"
                  wrapperClassName="mt-2"
                  placeholder=""
                  onBlur={onBlur}
                  onChangeText={onChange}
                  defaultValue={list?.description ?? ""}
                  value={value ?? ""}
                  ref={ref}
                />
              )}
            />
          </View>

          <View className="mt-4">
            <Controller
              name="image"
              control={form.control}
              render={({ field: { onChange, onBlur, ref, value } }) => (
                <TextField
                  label="Image"
                  wrapperClassName="mt-2"
                  placeholder="https://"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  defaultValue={list?.image ?? ""}
                  value={value ?? ""}
                  ref={ref}
                />
              )}
            />
          </View>

          <View className="mt-4">
            <FormLabel label="View" className="mb-4 pl-2.5" optional />
            <Controller
              name="view"
              control={form.control}
              render={({ field: { onChange, value } }) => (
                <FeedViewSelector value={value as any as FeedViewType} onChange={onChange} />
              )}
            />
          </View>

          <View className="mt-4">
            <Controller
              name="fee"
              control={form.control}
              render={({ field: { onChange, onBlur, ref, value } }) => (
                <NumberField
                  label="Fee"
                  wrapperClassName="mt-2"
                  placeholder="0"
                  onBlur={onBlur}
                  onChangeNumber={onChange}
                  defaultValue={list?.fee ?? 0}
                  value={value ?? 0}
                  inputPostfixElement={<PowerIcon color={accentColor} />}
                  ref={ref}
                />
              )}
            />
          </View>
        </GroupedInsetListCard>
      </KeyboardAwareScrollView>
    </FormProvider>
  )
}

interface ScreenOptionsProps {
  title?: string
}
const ScreenOptions = memo(({ title }: ScreenOptionsProps) => {
  const form = useFormContext()

  return (
    <Stack.Screen
      options={{
        headerLeft: ModalHeaderCloseButton,
        gestureEnabled: !form.formState.isDirty,

        headerRight: () => (
          <FormProvider form={form}>
            <ModalHeaderSubmitButton isValid onPress={() => {}} />
          </FormProvider>
        ),

        headerTitle: title ? `Edit List - ${title}` : "Create List",
      }}
    />
  )
})

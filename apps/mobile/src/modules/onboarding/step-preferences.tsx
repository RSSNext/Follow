import { router } from "expo-router"
import type { PropsWithChildren } from "react"
import { ActivityIndicator, Pressable, Text, TouchableOpacity, View } from "react-native"
import { useColor } from "react-native-uikit-colors"

import { useGeneralSettingKey } from "@/src/atoms/settings/general"
import { UserAvatar } from "@/src/components/ui/avatar/UserAvatar"
import { GroupedInsetListNavigationLinkIcon } from "@/src/components/ui/grouped/GroupedList"
import { DocmentCuteReIcon } from "@/src/icons/docment_cute_re"
import { FileImportCuteReIcon } from "@/src/icons/file_import_cute_re"
import { Magic2CuteReIcon } from "@/src/icons/magic_2_cute_re"
import { MingcuteRightLine } from "@/src/icons/mingcute_right_line"
import { LanguageMap } from "@/src/lib/language"
import { useWhoami } from "@/src/store/user/hooks"

import { importOpml, setAvatar } from "../settings/utils"
import { useReadingBehavior } from "./hooks/use-reading-behavior"

export const StepPreferences = () => {
  const translationLanguage = useGeneralSettingKey("translationLanguage")
  const language =
    translationLanguage in LanguageMap
      ? LanguageMap[translationLanguage as keyof typeof LanguageMap].label
      : translationLanguage
  const { behavior } = useReadingBehavior()

  return (
    <View className="mt-4 flex-1 p-4">
      <EditProfileSection />

      <View className="mb-6 gap-4">
        {/* Reading Preferences Card */}
        <PreferenceCard
          title="Reading Preferences"
          icon={
            <GroupedInsetListNavigationLinkIcon backgroundColor="#F59E0B">
              <DocmentCuteReIcon color="#fff" width={40} height={40} />
            </GroupedInsetListNavigationLinkIcon>
          }
          onPress={() => {
            router.push("/select-reading-mode")
          }}
        >
          {behavior === "radical" && (
            <Text className="text-secondary-label text-sm">
              Automatically mark entries as read when displayed
            </Text>
          )}
          {behavior === "balanced" && (
            <Text className="text-secondary-label text-sm">
              Automatically mark entries as read when scrolled out of view
            </Text>
          )}
          {behavior === "conservative" && (
            <Text className="text-secondary-label text-sm">
              Mark entries as read only when clicked
            </Text>
          )}
        </PreferenceCard>

        {/* Translation Language Card */}
        <PreferenceCard
          title="Translation Language"
          icon={
            <GroupedInsetListNavigationLinkIcon backgroundColor="#34D399">
              <Magic2CuteReIcon color="#fff" width={40} height={40} />
            </GroupedInsetListNavigationLinkIcon>
          }
        >
          <Text className="text-secondary-label text-sm">{language}</Text>
        </PreferenceCard>

        {/* Import Card */}
        <PreferenceCard
          title="Import Your Content"
          icon={
            <GroupedInsetListNavigationLinkIcon backgroundColor="#CBAD6D">
              <FileImportCuteReIcon color="#fff" width={40} height={40} />
            </GroupedInsetListNavigationLinkIcon>
          }
          onPress={importOpml}
        >
          <View className="flex-row">
            <Text className="text-secondary-label flex-1">
              If you have used RSS before, You can import OPML file
            </Text>
          </View>
        </PreferenceCard>
      </View>
    </View>
  )
}

export const EditProfileSection = () => {
  const whoami = useWhoami()

  if (!whoami) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    )
  }

  return (
    <View className="flex-1 items-center justify-center">
      <UserAvatar
        image={whoami?.image}
        name={whoami?.name}
        size={80}
        className={!whoami?.name || !whoami.image ? "bg-system-background" : ""}
      />

      <TouchableOpacity className="mt-2" hitSlop={10} onPress={setAvatar}>
        <Text className="text-accent text-lg">Set Avatar</Text>
      </TouchableOpacity>
    </View>
  )
}

type PreferenceCardProps = PropsWithChildren<{
  title: string
  icon?: React.ReactNode
  onPress?: () => void
}>

const PreferenceCard = ({ title, children, onPress, icon }: PreferenceCardProps) => {
  const rightIconColor = useColor("tertiaryLabel")

  return (
    <Pressable
      className="bg-secondary-system-grouped-background flex flex-row items-center gap-4 rounded-xl p-4"
      onPress={onPress}
    >
      {icon}
      <View className="flex flex-1 flex-col gap-2">
        <Text className="text-text text-base font-medium">{title}</Text>
        {children}
      </View>
      <MingcuteRightLine height={18} width={18} color={rightIconColor} />
    </Pressable>
  )
}

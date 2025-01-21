import Constants from "expo-constants"
import { Linking, Text, View } from "react-native"

import {
  NavigationBlurEffectHeader,
  SafeNavigationScrollView,
} from "@/src/components/common/SafeNavigationScrollView"
import {
  GroupedInsetListCard,
  GroupedInsetListNavigationLink,
  GroupedInsetListNavigationLinkIcon,
  GroupedInsetListSectionHeader,
} from "@/src/components/ui/grouped/GroupedList"
import { Logo } from "@/src/components/ui/logo"
import { Markdown } from "@/src/components/ui/typography/Markdown"
import { DiscordCuteFiIcon } from "@/src/icons/discord_cute_fi"
import { Github2CuteFiIcon } from "@/src/icons/github_2_cute_fi"
import { SocialXCuteReIcon } from "@/src/icons/social_x_cute_re"

const about = `
Follow is in the early stages of development. If you have any feedback or suggestions, please feel free to open an issue on the [GitHub repository](https://github.com/RSSNext/follow).

The icon library used is copyrighted by <a class="inline-flex items-center" href="https://mgc.mingcute.com/" target="_blank" rel="noreferrer">https://mgc.mingcute.com/</a> and cannot be redistributed.

Copyright © 2025 Follow. All rights reserved.
`

const links = [
  {
    title: "Github",
    icon: Github2CuteFiIcon,
    url: "https://github.com/RSSNext/follow",
    iconBackgroundColor: "#000000",
    iconColor: "#FFFFFF",
  },
  {
    title: "X",
    icon: SocialXCuteReIcon,
    url: "https://x.com/follow_app_",
    iconBackgroundColor: "#000000",
    iconColor: "#FFFFFF",
  },
  {
    title: "Discord",
    icon: DiscordCuteFiIcon,
    url: "https://discord.gg/followapp",
    iconBackgroundColor: "#5865F2",
    iconColor: "#FFFFFF",
  },
]

export const AboutScreen = () => {
  const buildId = Constants.expoConfig?.extra?.eas?.buildId || "Development"
  const appVersion = Constants.expoConfig?.version || "0.0.0"

  return (
    <SafeNavigationScrollView className="bg-system-grouped-background">
      <NavigationBlurEffectHeader title="About" />
      <View className="mt-8 flex-1 items-center justify-center">
        <Logo height={80} width={80} />
        <Text className="text-label font-sn mt-4 text-2xl font-semibold">Follow</Text>
        <Text className="text-tertiary-label font-mono text-sm">
          {appVersion} ({buildId})
        </Text>
      </View>
      <View className="flex-1 px-6">
        <Markdown
          value={about}
          webViewProps={{
            matchContents: true,
          }}
          className="text-[15px] leading-snug"
        />
      </View>
      <View className="mt-6">
        <GroupedInsetListSectionHeader label="Social Links" />
        <GroupedInsetListCard>
          {links.map((link) => (
            <GroupedInsetListNavigationLink
              key={link.title}
              label={link.title}
              icon={
                <GroupedInsetListNavigationLinkIcon backgroundColor={link.iconBackgroundColor}>
                  <link.icon color={link.iconColor} height={18} width={18} />
                </GroupedInsetListNavigationLinkIcon>
              }
              onPress={() => Linking.openURL(link.url)}
            />
          ))}
        </GroupedInsetListCard>
      </View>
    </SafeNavigationScrollView>
  )
}

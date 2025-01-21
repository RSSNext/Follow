import type { RSSHubCategories } from "@follow/constants"
import type { RSSHubRouteDeclaration } from "@follow/models/src/rsshub"
import { router } from "expo-router"
import type { FC } from "react"
import { memo, useMemo } from "react"
import { Clipboard, Linking, Text, TouchableOpacity, View } from "react-native"
import WebView from "react-native-webview"

import { ContextMenu } from "@/src/components/ui/context-menu"
import { Grid } from "@/src/components/ui/grid"
import { FeedIcon } from "@/src/components/ui/icon/feed-icon"

import { RSSHubCategoryCopyMap } from "./copy"

enum RecommendationListItemActionKey {
  COPY_MAINTAINER_NAME = "copyMaintainerName",
  OPEN_MAINTAINER_PROFILE = "openMaintainerProfile",
}

export const RecommendationListItem: FC<{
  data: RSSHubRouteDeclaration
  routePrefix: string
}> = memo(({ data, routePrefix }) => {
  const { maintainers, categories } = useMemo(() => {
    const maintainers = new Set<string>()
    const categories = new Set<string>()
    for (const route in data.routes) {
      const routeData = data.routes[route]!
      if (routeData.maintainers) {
        routeData.maintainers.forEach((m) => maintainers.add(m))
      }
      if (routeData.categories) {
        routeData.categories.forEach((c) => categories.add(c))
      }
    }
    categories.delete("popular")
    return {
      maintainers: Array.from(maintainers),
      categories: Array.from(categories) as typeof RSSHubCategories | string[],
    }
  }, [data])

  return (
    <View className="flex-row items-center p-4 px-6">
      <View className="mt-1.5 flex-row self-start overflow-hidden rounded-lg">
        <FeedIcon siteUrl={`https://${data.url}`} size={28} />
      </View>
      <View className="ml-2 flex-1">
        <Text className="text-text text-base font-medium">{data.name}</Text>
        {/* Maintainers */}
        <View className="flex-row flex-wrap items-center">
          {maintainers.map((m) => (
            <ContextMenu
              key={m}
              renderPreview={() => {
                return <WebView source={{ uri: `https://github.com/${m}` }} />
              }}
              config={{
                items: [
                  {
                    title: "Copy Maintainer Name",
                    actionKey: RecommendationListItemActionKey.COPY_MAINTAINER_NAME,
                  },
                  {
                    title: "Open Maintainer's Profile",
                    actionKey: RecommendationListItemActionKey.OPEN_MAINTAINER_PROFILE,
                  },
                ],
              }}
              onPressMenuItem={(e) => {
                switch (e.actionKey) {
                  case RecommendationListItemActionKey.COPY_MAINTAINER_NAME: {
                    Clipboard.setString(m)
                    break
                  }
                  case RecommendationListItemActionKey.OPEN_MAINTAINER_PROFILE: {
                    Linking.openURL(`https://github.com/${m}`)
                    break
                  }
                }
              }}
            >
              <View className="bg-system-background mr-1 rounded-full">
                <Text className="text-secondary-label text-sm">@{m}</Text>
              </View>
            </ContextMenu>
          ))}
        </View>
        {/* Tags */}
        <View className="mt-0.5 flex-row items-center">
          {categories.map((c) => (
            <View
              className="bg-gray-5 mr-1 items-center justify-center overflow-hidden rounded-lg px-2 py-1"
              key={c}
            >
              <Text className="text-text/60 text-sm leading-none">
                {RSSHubCategoryCopyMap[c as keyof typeof RSSHubCategoryCopyMap]}
              </Text>
            </View>
          ))}
        </View>

        {/* Items */}

        <Grid columns={2} gap={8} className="mt-2">
          {Object.keys(data.routes).map((route) => (
            <View className="relative" key={route}>
              <TouchableOpacity
                onPress={() => {
                  router.push({
                    pathname: "/rsshub-form",
                    params: {
                      routePrefix,
                      route: JSON.stringify(data.routes[route]),
                      name: data.name,
                    },
                  })
                }}
                className="bg-gray-5 h-10 flex-row items-center justify-center overflow-hidden rounded px-2"
              />
              <View className="absolute inset-2 items-center justify-center" pointerEvents="none">
                <Text ellipsizeMode="middle" numberOfLines={1} className="text-text whitespace-pre">
                  {data.routes[route]!.name}
                </Text>
              </View>
            </View>
          ))}
        </Grid>
      </View>
    </View>
  )
})

import { cn } from "@follow/utils"
import { Image } from "expo-image"
import { Stack } from "expo-router"
import { ScrollView, TouchableOpacity, View } from "react-native"
import { Grayscale } from "react-native-color-matrix-image-filters"

import { BlurEffect } from "@/src/components/common/BlurEffect"
import { FallbackIcon } from "@/src/components/ui/icon/fallback-icon"
import type { ViewDefinition } from "@/src/constants/views"
import { views } from "@/src/constants/views"
import { useList } from "@/src/store/list/hooks"
import { useAllListSubscription } from "@/src/store/subscription/hooks"
import { useColor } from "@/src/theme/colors"

import { LeftAction, RightAction } from "../entry-list/action"
import { selectFeed, useSelectedFeed } from "../feed-drawer/atoms"

export function ViewSelector() {
  return (
    <Stack.Screen
      options={{
        headerShown: true,
        headerTitle: ViewItems,
        headerLeft: LeftAction,
        headerRight: RightAction,
        headerTransparent: true,
        headerBackground: BlurEffect,
      }}
    />
  )
}

function ViewItems() {
  const lists = useAllListSubscription()

  return (
    <ScrollView horizontal className="mx-7">
      {views.map((view) => (
        <ViewItem key={view.name} view={view} />
      ))}
      {lists.map((listId) => (
        <ListItem key={listId} listId={listId} />
      ))}
    </ScrollView>
  )
}

function ViewItem({ view }: { view: ViewDefinition }) {
  const selectedFeed = useSelectedFeed()
  const isActive = selectedFeed.type === "view" && selectedFeed.viewId === view.view

  const bgColor = useColor("gray2")

  return (
    <TouchableOpacity
      className="relative flex aspect-square items-center justify-center"
      onPress={() => selectFeed({ type: "view", viewId: view.view })}
    >
      <View className="flex size-8 items-center justify-center overflow-hidden rounded-full">
        <View
          className="flex size-full items-center justify-center"
          style={{
            backgroundColor: isActive ? view.activeColor : bgColor,
          }}
        >
          <view.icon color={"#fff"} height={15} width={15} />
        </View>
      </View>
    </TouchableOpacity>
  )
}

function ListItem({ listId }: { listId: string }) {
  const list = useList(listId)
  const selectedFeed = useSelectedFeed()
  const isActive = selectedFeed.type === "list" && selectedFeed.listId === listId

  if (!list) return null

  return (
    <TouchableOpacity
      className="relative flex aspect-square items-center justify-center"
      onPress={() => selectFeed({ type: "list", listId })}
    >
      <View className="flex size-8 items-center justify-center overflow-hidden rounded-full">
        <View className={cn("flex size-full items-center justify-center")}>
          {list.image ? (
            isActive ? (
              <Image source={list.image} contentFit="cover" style={{ width: 32, height: 32 }} />
            ) : (
              <Grayscale>
                <Image source={list.image} contentFit="cover" style={{ width: 32, height: 32 }} />
              </Grayscale>
            )
          ) : (
            <FallbackIcon title={list.title} size="100%" gray={!isActive} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  )
}

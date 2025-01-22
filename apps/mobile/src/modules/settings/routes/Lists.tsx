import { useQuery } from "@tanstack/react-query"
import { createElement, useCallback } from "react"
import type { ListRenderItem } from "react-native"
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Animated, { LinearTransition } from "react-native-reanimated"
import { useColor } from "react-native-uikit-colors"

import { Balance } from "@/src/components/common/Balance"
import {
  NavigationBlurEffectHeader,
  SafeNavigationScrollView,
} from "@/src/components/common/SafeNavigationScrollView"
import {
  GroupedInformationCell,
  GroupedInsetListCard,
} from "@/src/components/ui/grouped/GroupedList"
import { FallbackIcon } from "@/src/components/ui/icon/fallback-icon"
import { LoadingIndicator } from "@/src/components/ui/loading"
import { views } from "@/src/constants/views"
import { AddCuteReIcon } from "@/src/icons/add_cute_re"
import { PowerIcon } from "@/src/icons/power"
import { RadaCuteFiIcon } from "@/src/icons/rada_cute_fi"
import { UserAdd2CuteFiIcon } from "@/src/icons/user_add_2_cute_fi"
import { Wallet2CuteFiIcon } from "@/src/icons/wallet_2_cute_fi"
import type { HonoApiClient } from "@/src/morph/types"
import { listSyncServices } from "@/src/store/list/store"
import { accentColor } from "@/src/theme/colors"

import { SwipeableGroupProvider, SwipeableItem } from "../../../components/common/SwipeableItem"

export const ListsScreen = () => {
  const { isLoading, data } = useQuery({
    queryKey: ["owned", "lists"],
    queryFn: () => listSyncServices.fetchOwnedLists(),
  })

  return (
    <SafeNavigationScrollView nestedScrollEnabled className="bg-system-grouped-background">
      <NavigationBlurEffectHeader
        title="Lists"
        headerRight={useCallback(
          () => (
            <AddListButton />
          ),
          [],
        )}
      />

      <View className="mt-6">
        <GroupedInsetListCard>
          <GroupedInformationCell
            title="Lists"
            description="Lists are collections of feeds that you can share or sell for others to subscribe to. Subscribers will synchronize and access all feeds in the list."
            icon={<RadaCuteFiIcon height={40} width={40} color="#fff" />}
            iconBackgroundColor="#34D399"
          />
        </GroupedInsetListCard>
      </View>
      <View className="mt-6">
        {data && (
          <GroupedInsetListCard>
            <SwipeableGroupProvider>
              <Animated.FlatList
                keyExtractor={keyExtractor}
                itemLayoutAnimation={LinearTransition}
                scrollEnabled={false}
                data={data}
                renderItem={ListItemCell}
                ItemSeparatorComponent={ItemSeparatorComponent}
              />
            </SwipeableGroupProvider>
          </GroupedInsetListCard>
        )}
      </View>
      {isLoading && (
        <View className="flex-1 items-center justify-center">
          <LoadingIndicator />
        </View>
      )}
    </SafeNavigationScrollView>
  )
}

const AddListButton = () => {
  const labelColor = useColor("label")
  return (
    <TouchableOpacity hitSlop={10}>
      <AddCuteReIcon height={20} width={20} color={labelColor} />
    </TouchableOpacity>
  )
}

const ItemSeparatorComponent = () => {
  return (
    <View
      className="bg-opaque-separator ml-24 flex-1"
      style={{ height: StyleSheet.hairlineWidth }}
    />
  )
}

const keyExtractor = (item: HonoApiClient.List_List_Get) => item.id

const ListItemCell: ListRenderItem<HonoApiClient.List_List_Get> = ({ item: list }) => {
  const { title, description } = list
  return (
    <SwipeableItem
      rightActions={[
        {
          label: "Edit",
          onPress: () => {
            // TODO
          },
          backgroundColor: "#0ea5e9",
        },
      ]}
    >
      <View className="bg-secondary-system-grouped-background flex-row p-4">
        <View className="size-16 overflow-hidden rounded-lg">
          {list.image ? (
            <Image source={{ uri: list.image }} resizeMode="cover" className="size-full" />
          ) : (
            <FallbackIcon title={list.title || ""} size="100%" textStyle={styles.title} />
          )}
        </View>
        <View className="ml-4 flex-1">
          <Text
            className="text-label text-lg font-semibold leading-tight"
            numberOfLines={1}
            ellipsizeMode="middle"
          >
            {title}
          </Text>
          <Text className="text-secondary-label text-base" numberOfLines={4}>
            {description}
          </Text>
          <View className="flex-row items-center gap-1">
            {!!views[list.view]?.icon &&
              createElement(views[list.view]!.icon, {
                color: views[list.view]!.activeColor,
                height: 16,
                width: 16,
              })}
            <Text className="text-secondary-label text-base">{views[list.view]?.name}</Text>
          </View>
        </View>

        <View
          className="bg-opaque-separator mx-4 h-full"
          style={{ width: StyleSheet.hairlineWidth }}
        />
        <View className="w-16 gap-1">
          <View className="flex-row items-center gap-1">
            <PowerIcon height={16} width={16} color={accentColor} />
            <Text className="text-secondary-label text-sm">{list.fee}</Text>
          </View>

          <View className="flex-row items-center gap-1">
            <UserAdd2CuteFiIcon height={16} width={16} color={accentColor} />
            <Text className="text-secondary-label text-sm">{list.subscriptionCount || 0}</Text>
          </View>

          {!!list.purchaseAmount && (
            <View className="flex-row items-center gap-1">
              <Wallet2CuteFiIcon height={16} width={16} color={accentColor} />
              <Balance className="text-secondary-label text-sm">
                {BigInt(list.purchaseAmount)}
              </Balance>
            </View>
          )}
        </View>
      </View>
    </SwipeableItem>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "semibold",
  },
})

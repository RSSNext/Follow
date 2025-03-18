import type { PrimitiveAtom } from "jotai"
import { atom, useAtomValue, useSetAtom } from "jotai"
import type { FC, ReactNode } from "react"
import { memo, useContext, useMemo } from "react"
import { StyleSheet, View } from "react-native"
import { useSharedValue } from "react-native-reanimated"
import type { ScreenStackHeaderConfigProps, StackPresentationTypes } from "react-native-screens"
import { ScreenStackItem } from "react-native-screens"

import { useNavigation } from "@/src/lib/navigation/hooks"
import { useColor } from "@/src/theme/colors"

import { useCombinedLifecycleEvents } from "./__internal/hooks"
import { defaultHeaderConfig } from "./config"
import type { ScreenItemContextType } from "./ScreenItemContext"
import { ScreenItemContext } from "./ScreenItemContext"
import type { ScreenOptionsContextType } from "./ScreenOptionsContext"
import { ScreenOptionsContext } from "./ScreenOptionsContext"

export const WrappedScreenItem: FC<
  {
    screenId: string
    children: React.ReactNode
    stackPresentation?: StackPresentationTypes

    headerConfig?: ScreenStackHeaderConfigProps
  } & ScreenOptionsContextType
> = memo(({ screenId, children, stackPresentation, headerConfig, ...rest }) => {
  const navigation = useNavigation()
  const reAnimatedScrollY = useSharedValue(0)
  const ctxValue = useMemo<ScreenItemContextType>(
    () => ({
      screenId,
      isFocusedAtom: atom(false),
      isAppearedAtom: atom(false),
      isDisappearedAtom: atom(false),
      reAnimatedScrollY,
      Slot: atom<{
        header: ReactNode
      }>({
        header: null,
      }),
    }),
    [screenId, reAnimatedScrollY],
  )
  const setIsFocused = useSetAtom(ctxValue.isFocusedAtom)
  const setIsAppeared = useSetAtom(ctxValue.isAppearedAtom)
  const setIsDisappeared = useSetAtom(ctxValue.isDisappearedAtom)

  const combinedLifecycleEvents = useCombinedLifecycleEvents(ctxValue.screenId, {
    onAppear: () => {
      setIsFocused(true)
      setIsAppeared(true)
      setIsDisappeared(false)
    },
    onDisappear: () => {
      setIsFocused(false)
      setIsAppeared(false)
      setIsDisappeared(true)
    },
    onWillAppear: () => {
      setIsFocused(false)
      setIsAppeared(true)
      setIsDisappeared(false)
    },
    onWillDisappear: () => {
      setIsFocused(false)
      setIsAppeared(false)
      setIsDisappeared(true)
    },
  })

  const screenOptionsCtxValue = useMemo<PrimitiveAtom<ScreenOptionsContextType>>(() => atom({}), [])

  const screenOptions = useAtomValue(screenOptionsCtxValue)

  const backgroundColor = useColor("systemBackground")

  return (
    <ScreenItemContext.Provider value={ctxValue}>
      <ScreenOptionsContext.Provider value={screenOptionsCtxValue}>
        <ScreenStackItem
          {...combinedLifecycleEvents}
          headerConfig={{
            ...defaultHeaderConfig,
            ...headerConfig,
          }}
          key={screenId}
          screenId={screenId}
          stackPresentation={stackPresentation}
          style={[StyleSheet.absoluteFill, { backgroundColor }]}
          onDismissed={() => {
            navigation.__internal_dismiss(screenId)
          }}
          {...rest}
          {...screenOptions}
        >
          <Header />
          {children}
        </ScreenStackItem>
      </ScreenOptionsContext.Provider>
    </ScreenItemContext.Provider>
  )
})
const Header = () => {
  const ctxValue = useContext(ScreenItemContext)

  const Slot = useAtomValue(ctxValue.Slot)

  if (!Slot.header) {
    return null
  }
  return <View className="absolute inset-x-0 top-0 z-[99]">{Slot.header}</View>
}

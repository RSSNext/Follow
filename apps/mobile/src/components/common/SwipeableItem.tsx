import { atom, useAtomValue, useSetAtom } from "jotai"
import { selectAtom } from "jotai/utils"
import * as React from "react"
import { Animated, StyleSheet, Text, View } from "react-native"
import { RectButton, Swipeable } from "react-native-gesture-handler"

interface Action {
  label: string
  icon?: React.ReactNode
  backgroundColor?: string
  onPress?: () => void
  color?: string
}

interface SwipeableItemProps {
  children: React.ReactNode
  leftActions?: Action[]
  rightActions?: Action[]
  disabled?: boolean
}

const styles = StyleSheet.create({
  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
  },
  actionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  animatedContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
  },
  actionsWrapper: {
    flexDirection: "row",
  },
  actionText: {
    color: "#fff",
  },
})

export const SwipeableItem: React.FC<SwipeableItemProps> = ({
  children,
  leftActions,
  rightActions,
  disabled,
}) => {
  const [leftHaptic, setLeftHaptic] = React.useState(false)
  const [rightHaptic, setRightHaptic] = React.useState(false)
  const itemRef = React.useRef<Swipeable | null>(null)

  const renderLeftActions = (progress: Animated.AnimatedInterpolation<number>) => {
    const width = leftActions?.length ? leftActions.length * 74 : 74

    return (
      <>
        <View
          style={[
            styles.absoluteFill,
            {
              backgroundColor: leftActions?.[0]?.backgroundColor ?? "#fff",
            },
          ]}
        />
        <Animated.View style={[styles.actionsWrapper, { width }]}>
          {leftActions?.map((action, index) => {
            const trans = progress.interpolate({
              inputRange: [0, 1],
              outputRange: [-74 * (leftHaptic ? (leftActions?.length ?? 1) : index + 1), 0],
            })

            if (index === 0) {
              trans.addListener(({ value }) => {
                if (value >= (leftActions?.length === 1 ? 40 : 20)) {
                  setLeftHaptic(true)
                } else {
                  leftHaptic && setLeftHaptic(false)
                }
              })
            }

            return (
              <Animated.View
                key={index}
                style={[
                  styles.animatedContainer,
                  {
                    transform: [{ translateX: trans }],
                    width: leftHaptic && index === 0 ? "100%" : 74,
                    left: index * 74,
                  },
                ]}
              >
                <RectButton
                  style={[
                    styles.actionContainer,
                    {
                      backgroundColor: action.backgroundColor ?? "#fff",
                    },
                  ]}
                  onPress={action.onPress}
                >
                  {action.icon}
                  <Text style={[styles.actionText, { color: action.color ?? "#fff" }]}>
                    {action.label}
                  </Text>
                </RectButton>
              </Animated.View>
            )
          })}
        </Animated.View>
      </>
    )
  }

  const renderRightActions = (progress: Animated.AnimatedInterpolation<number>) => {
    const width = rightActions?.length ? rightActions.length * 74 : 74

    return (
      <>
        <View
          style={[
            styles.absoluteFill,
            {
              backgroundColor: rightActions?.[0]?.backgroundColor ?? "#fff",
            },
          ]}
        />
        <Animated.View style={[styles.actionsWrapper, { width }]}>
          {rightActions?.map((action, index) => {
            const trans = progress.interpolate({
              inputRange: [0, 1],
              outputRange: [74 * (rightHaptic ? (rightActions?.length ?? 1) : index + 1), 0],
            })

            if (index === 0) {
              trans.addListener(({ value }) => {
                if (value <= (rightActions?.length === 1 ? -40 : -20)) {
                  setRightHaptic(true)
                } else {
                  rightHaptic && setRightHaptic(false)
                }
              })
            }

            return (
              <Animated.View
                key={index}
                style={[
                  styles.animatedContainer,
                  {
                    transform: [{ translateX: trans }],
                    width: rightHaptic && index === 0 ? "100%" : 74,
                    left: index * 74,
                  },
                ]}
              >
                <RectButton
                  style={[
                    styles.actionContainer,
                    {
                      backgroundColor: action.backgroundColor ?? "#fff",
                    },
                  ]}
                  onPress={action.onPress}
                >
                  {action.icon}
                  <Text style={styles.actionText}>{action.label}</Text>
                </RectButton>
              </Animated.View>
            )
          })}
        </Animated.View>
      </>
    )
  }

  const id = React.useId()
  const { swipeableOpenedId } = React.useContext(SwipeableGroupContext)

  const setAtom = useSetAtom(swipeableOpenedId)
  const isOpened = useAtomValue(
    React.useMemo(
      () => selectAtom(swipeableOpenedId, (value) => value === id),
      [id, swipeableOpenedId],
    ),
  )

  React.useEffect(() => {
    if (!isOpened) {
      itemRef.current?.close()
    }
  }, [isOpened])

  return (
    <Swipeable
      ref={itemRef}
      enabled={!disabled}
      friction={1}
      onSwipeableWillOpen={() => {
        setAtom(id)
      }}
      leftThreshold={37}
      rightThreshold={37}
      enableTrackpadTwoFingerGesture
      useNativeAnimations
      onEnded={(e: any) => {
        const { translationX } = e.nativeEvent
        if (
          leftHaptic &&
          translationX >= (leftActions?.length === 1 ? 100 : 60) * (leftActions?.length ?? 1)
        ) {
          leftActions?.[0]?.onPress?.()
        }
        if (
          rightHaptic &&
          translationX <= (rightActions?.length === 1 ? -100 : -60) * (rightActions?.length ?? 1)
        ) {
          rightActions?.[0]?.onPress?.()
        }
      }}
      renderLeftActions={leftActions?.length ? renderLeftActions : undefined}
      renderRightActions={rightActions?.length ? renderRightActions : undefined}
      overshootLeft={leftActions?.length ? leftActions?.length >= 1 : undefined}
      overshootRight={rightActions?.length ? rightActions?.length >= 1 : undefined}
      overshootFriction={3}
    >
      {children}
    </Swipeable>
  )
}

const SwipeableGroupContext = React.createContext({
  swipeableOpenedId: atom(""),
})

export const SwipeableGroupProvider = ({ children }: { children: React.ReactNode }) => {
  const ctx = React.useMemo(
    () => ({
      swipeableOpenedId: atom(""),
    }),
    [],
  )

  return <SwipeableGroupContext.Provider value={ctx}>{children}</SwipeableGroupContext.Provider>
}

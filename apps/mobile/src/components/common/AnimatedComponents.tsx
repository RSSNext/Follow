import { Animated, FlatList, Pressable, ScrollView, TouchableOpacity } from "react-native"
import Reanimated from "react-native-reanimated"

export const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView)
export const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)
export const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)

export const ReAnimatedPressable = Reanimated.createAnimatedComponent(Pressable)

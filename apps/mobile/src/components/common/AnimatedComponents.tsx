import { Image as ExpoImage } from "expo-image"
import { Animated, FlatList, ScrollView, TouchableOpacity } from "react-native"
import ReAnimated from "react-native-reanimated"

export const ReAnimatedExpoImage = ReAnimated.createAnimatedComponent(ExpoImage)
export const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView)
export const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)
export const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)

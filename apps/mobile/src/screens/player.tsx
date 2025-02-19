import { router } from "expo-router"
import { Text, View } from "react-native"
import { SheetScreen } from "react-native-sheet-transitions"

export default function PlaterScreen() {
  return (
    <SheetScreen
      onClose={() => router.back()}
      dragDirections={{ toBottom: true, toTop: false, toLeft: false, toRight: false }}
      opacityOnGestureMove={true}
      containerRadiusSync={true}
    >
      <View className="bg-red flex flex-1 items-center justify-center">
        <Text>hi</Text>
      </View>
    </SheetScreen>
  )
}

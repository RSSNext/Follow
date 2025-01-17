import type { FC, PropsWithChildren } from "react"
import { View } from "react-native"

export const SettingNavigationLinkIcon: FC<
  {
    backgroundColor: string
  } & PropsWithChildren
> = ({ backgroundColor, children }) => {
  return (
    <View
      className="mr-4 items-center justify-center rounded-[5px] p-1"
      style={{
        backgroundColor,
      }}
    >
      {children}
    </View>
  )
}

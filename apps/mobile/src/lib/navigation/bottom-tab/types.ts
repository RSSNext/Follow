import type { FC } from "react"

export type TabbarIconProps = {
  focused: boolean
  size: number
  color: string
}
export type TabScreenComponent = FC & {
  tabBarIcon?: (props: TabbarIconProps) => React.ReactNode
  title?: string

  lazy?: boolean
}

import type { ViewProps } from "react-native"
import type { RenderItem } from "react-native-ios-context-menu"

export interface IContextMenuConfig {
  title?: string
  subTitle?: string
  items: NullableContextMenuItemConfig[]
}

export type NullableContextMenuItemConfig = IContextMenuItemConfig | false | null | undefined
export interface IContextMenuItemConfig {
  title: string
  // icon?: IconConfig | ImageItemConfig
  /**
   * @note only available on iOS
   */
  systemIcon?: string

  subMenu?: IContextMenuConfig

  destructive?: boolean
  disabled?: boolean
  hidden?: boolean
  checked?: boolean

  actionKey: string
}

export interface ContextMenuProps extends ViewProps {
  config: IContextMenuConfig
  onPressMenuItem: (item: IContextMenuItemConfig) => void

  /**
   * @note only available on iOS
   */
  renderPreview?: RenderItem
  /**
   * @note only available on iOS
   */
  onPressPreview?: () => void
}

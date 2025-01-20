// export { default as ContextMenu, type ContextMenuProps } from "react-native-context-menu-view"

import type { FC, PropsWithChildren } from "react"
import { useMemo, useState } from "react"
import { View } from "react-native"
import type { MenuAttributes, MenuConfig, MenuElementConfig } from "react-native-ios-context-menu"
import { ContextMenuView } from "react-native-ios-context-menu"

import { useColor } from "@/src/theme/colors"

import type { ContextMenuProps, IContextMenuItemConfig } from "./types"

export const ContextMenu: FC<ContextMenuProps & PropsWithChildren> = ({
  config,
  onPressMenuItem,
  children,
  renderPreview,
  onPressPreview,
  ...props
}) => {
  const [actionKeyMap] = useState(() => new Map<string, IContextMenuItemConfig>())
  const menuViewConfig = useMemo((): MenuConfig => {
    const createMenuItems = (items: typeof config.items): MenuElementConfig[] => {
      return items
        .filter((item) => !!item)
        .map((item) => {
          actionKeyMap.set(item.actionKey, item)

          const menuAttributes: MenuAttributes[] = []
          if (item.destructive) {
            menuAttributes.push("destructive")
          }
          if (item.disabled) {
            menuAttributes.push("disabled")
          }
          if (item.hidden) {
            menuAttributes.push("hidden")
          }

          const menuItem: MenuElementConfig = {
            actionTitle: item.title,
            actionKey: item.actionKey,
            icon: item.systemIcon ? { iconType: "SYSTEM", iconValue: item.systemIcon } : undefined,
            menuAttributes,
          }

          if (item.subMenu) {
            const subMenuConfig = menuItem as any as MenuConfig
            subMenuConfig.menuTitle = item.subMenu.title || item.title || ""
            subMenuConfig.menuSubtitle = item.subMenu.subTitle || ""
            subMenuConfig.menuItems = createMenuItems(item.subMenu.items)
          }

          if (item.checked) {
            menuItem.menuState = "on"
          }

          return menuItem
        })
    }

    return {
      menuTitle: config.title || "",
      menuSubtitle: config.subTitle || "",
      menuItems: createMenuItems(config.items),
    }
  }, [config, actionKeyMap])

  const backgroundColor = useColor("systemBackground")
  return (
    <View {...props}>
      <ContextMenuView
        previewConfig={
          renderPreview
            ? {
                backgroundColor,
                previewType: "CUSTOM",
                previewSize: "STRETCH",
              }
            : undefined
        }
        renderPreview={renderPreview}
        menuConfig={menuViewConfig}
        onPressMenuPreview={onPressPreview}
        onPressMenuItem={(e) => {
          onPressMenuItem(actionKeyMap.get(e.nativeEvent.actionKey)!)
        }}
      >
        {children}
      </ContextMenuView>
    </View>
  )
}

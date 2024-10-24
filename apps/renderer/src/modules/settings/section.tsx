/* eslint-disable @eslint-react/no-children-to-array */
/* eslint-disable @eslint-react/no-children-map */

import { cn } from "@follow/utils/utils"
import type { FC, PropsWithChildren, ReactNode } from "react"
import { cloneElement } from "react"
import * as React from "react"

import { SettingActionItem, SettingDescription, SettingSwitch } from "./control"

export const SettingSectionTitle: FC<{
  title: string | ReactNode

  margin?: "compact" | "normal"
}> = ({ title, margin }) => (
  <div
    className={cn(
      "shrink-0 text-sm font-medium capitalize text-gray-400 first:mt-0 dark:text-neutral-500",
      margin === "compact" ? "mb-2 mt-8" : "mb-4 mt-8",
    )}
  >
    {title}
  </div>
)

export const SettingItemGroup: FC<PropsWithChildren> = ({ children }) => {
  const childrenArray = React.Children.toArray(children)
  return React.Children.map(children, (child, index) => {
    if (typeof child !== "object") return child

    if (child === null) return child

    const compType = (child as React.ReactElement).type
    if (compType === SettingDescription) {
      const prevIndex = index - 1
      const prevChild = childrenArray[prevIndex]
      const prevType = getChildType(prevChild)

      switch (prevType) {
        case SettingSwitch: {
          return cloneElement(child as React.ReactElement, {
            className: "!-mt-2",
          })
        }
        case SettingActionItem: {
          return cloneElement(child as React.ReactElement, {
            className: "!-mt-2",
          })
        }
        default: {
          return child
        }
      }
    }

    return child
  })
}

const getChildType = (child: ReactNode) => {
  if (typeof child !== "object") return null

  if (child === null) return null

  return (child as React.ReactElement).type
}

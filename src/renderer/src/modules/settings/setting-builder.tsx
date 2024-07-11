/* eslint-disable @eslint-react/no-array-index-key */
import type { FC, ReactNode } from "react"
import { isValidElement } from "react"
import * as React from "react"

import { SettingDescription, SettingSwitch } from "./control"
import { SettingItemGroup, SettingSectionTitle } from "./section"

type SharedSettingItem = {
  disabled?: boolean
}

type SettingItem<T, K extends keyof T = keyof T> = {
  key: K
  label: string
  description?: string
  onChange: (value: T[K]) => void
} & SharedSettingItem

type SpecificSettingItem = {
  type: "title"
  value?: string
} & SharedSettingItem

type CustomSettingItem = ReactNode | FC

export const createSettingBuilder =
  <T extends object>(useSetting: () => T) =>
    <K extends keyof T>(props: {
      settings: (
        | SettingItem<T, K>
        | SpecificSettingItem
        | CustomSettingItem
        | boolean
      )[]
    }) => {
      const { settings } = props
      const settingObject = useSetting()

      return settings
        .filter((i) => typeof i !== "boolean")
        .map((setting, index) => {
          if (isValidElement(setting)) return setting
          if (typeof setting === "function") { return React.createElement(setting, { key: index }) }
          const assertSetting = setting as SettingItem<T> | SpecificSettingItem

          if (assertSetting.disabled) return null

          if (
            "type" in assertSetting &&
            assertSetting.type === "title" &&
            assertSetting.value
          ) {
            return (
              <SettingSectionTitle key={index} title={assertSetting.value} />
            )
          }
          if ("type" in assertSetting) {
            return null
          }

          let ControlElement: React.ReactNode
          switch (typeof settingObject[assertSetting.key]) {
            case "boolean": {
              ControlElement = (
                <SettingSwitch
                  className="mt-4"
                  checked={settingObject[assertSetting.key] as boolean}
                  onCheckedChange={(checked) =>
                    assertSetting.onChange(checked as T[keyof T])}
                  label={assertSetting.label}
                />
              )
              break
            }
            case "string": {
              return null
            }
            default: {
              return null
            }
          }
          return (
            <SettingItemGroup key={index}>
              {ControlElement}
              {!!assertSetting.description && (
                <SettingDescription>
                  {assertSetting.description}
                </SettingDescription>
              )}
            </SettingItemGroup>
          )
        })
    }

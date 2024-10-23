/* eslint-disable @eslint-react/no-array-index-key */
import { isNil } from "lodash-es"
import type { FC, ReactNode } from "react"
import * as React from "react"
import { isValidElement } from "react"

import { SettingActionItem, SettingDescription, SettingInput, SettingSwitch } from "../control"
import { SettingItemGroup, SettingSectionTitle } from "../section"

type SharedSettingItem = {
  disabled?: boolean
}

export type SettingItem<T, K extends keyof T = keyof T> = {
  key: K
  label: string
  description?: string
  onChange: (value: T[K]) => void
  type?: "password"

  vertical?: boolean

  componentProps?: {
    labelClassName?: string
    className?: string
    [key: string]: any
  }
} & SharedSettingItem

type SectionSettingItem = {
  type: "title"
  value?: string
} & SharedSettingItem

type ActionSettingItem = {
  label: string
  action: () => void
  description?: string
  buttonText: string
} & SharedSettingItem
type CustomSettingItem = ReactNode | FC

export const createSettingBuilder =
  <T extends object>(useSetting: () => T) =>
  <K extends keyof T>(props: {
    settings: (
      | SettingItem<T, K>
      | SectionSettingItem
      | CustomSettingItem
      | ActionSettingItem
      | boolean
    )[]
  }) => {
    const { settings } = props
    const settingObject = useSetting()

    return settings
      .filter((i) => !isNil(i))
      .map((setting, index) => {
        if (isValidElement(setting)) return setting
        if (typeof setting === "function") {
          return React.createElement(setting, { key: index })
        }
        const assertSetting = setting as SettingItem<T> | SectionSettingItem | ActionSettingItem

        if (!assertSetting) return null
        if (assertSetting.disabled) return null

        if ("type" in assertSetting && assertSetting.type === "title" && assertSetting.value) {
          return <SettingSectionTitle key={index} title={assertSetting.value} />
        }
        if ("type" in assertSetting && assertSetting.type === "title") {
          return null
        }

        let ControlElement: React.ReactNode

        if ("key" in assertSetting) {
          switch (typeof settingObject[assertSetting.key]) {
            case "boolean": {
              ControlElement = (
                <SettingSwitch
                  className="mt-4"
                  checked={settingObject[assertSetting.key] as boolean}
                  onCheckedChange={(checked) => assertSetting.onChange(checked as T[keyof T])}
                  label={assertSetting.label}
                />
              )
              break
            }
            case "string": {
              ControlElement = (
                <SettingInput
                  vertical={assertSetting.vertical}
                  labelClassName={assertSetting.componentProps?.labelClassName}
                  type={assertSetting.type || "text"}
                  className="mt-4"
                  value={settingObject[assertSetting.key] as string}
                  onChange={(event) => assertSetting.onChange(event.target.value as T[keyof T])}
                  label={assertSetting.label}
                />
              )
              break
            }
            default: {
              return null
            }
          }
        } else if ("action" in assertSetting) {
          ControlElement = <SettingActionItem {...assertSetting} key={index} />
        }
        return (
          <SettingItemGroup key={index}>
            {ControlElement}
            {!!assertSetting.description && (
              <SettingDescription>{assertSetting.description}</SettingDescription>
            )}
          </SettingItemGroup>
        )
      })
  }

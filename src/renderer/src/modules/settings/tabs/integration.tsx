import { createSetting } from "@renderer/atoms/settings/helper"
import {
  setIntegrationSetting,
  useIntegrationSettingValue,
} from "@renderer/atoms/settings/integration"
import { Divider } from "@renderer/components/ui/divider"
import {
  SimpleIconsEagle,
  SimpleIconsInstapaper,
  SimpleIconsReadwise,
} from "@renderer/components/ui/platform-icon/icons"

import { SettingsTitle } from "../title"

const { defineSettingItem, SettingBuilder } = createSetting(
  useIntegrationSettingValue,
  setIntegrationSetting,
)
export const SettingIntegration = () => (
  <>
    <SettingsTitle />
    <div className="mt-4">
      <SettingBuilder
        settings={[
          {
            type: "title",
            value: (
              <span className="flex items-center gap-2 font-bold">
                <SimpleIconsEagle />
                Eagle
              </span>
            ),
          },
          defineSettingItem("enableEagle", {
            label: "Enable",
            description: (
              <>
                Display <i>Save media to Eagle</i> button when available.
              </>
            ),
          }),
          {
            type: "title",
            value: (
              <span className="flex items-center gap-2 font-bold">
                <SimpleIconsReadwise />
                Readwise
              </span>
            ),
          },
          defineSettingItem("enableReadwise", {
            label: "Enable",
            description: (
              <>
                Display <i>Save to Readwise</i> button when available.
              </>
            ),
          }),
          defineSettingItem("readwiseToken", {
            label: "Readwise Access Token",
            vertical: true,
            type: "password",
            description: (
              <>
                You can get it here:{" "}
                <a
                  target="_blank"
                  className="underline"
                  rel="noreferrer noopener"
                  href="https://readwise.io/access_token"
                >
                  readwise.io/access_token
                </a>
                .
              </>
            ),
          }),
          {
            type: "title",
            value: (
              <span className="flex items-center gap-2 font-bold">
                <SimpleIconsInstapaper />
                Instapaper
              </span>
            ),
          },
          defineSettingItem("enableInstapaper", {
            label: "Enable",
            description: (
              <>
                Display <i>Save to Instapaper</i> button when available.
              </>
            ),
          }),
          defineSettingItem("instapaperUsername", {
            label: "Instapaper Username",
            componentProps: {
              labelClassName: "w-[150px]",
            },
          }),
          defineSettingItem("instapaperPassword", {
            label: "Instapaper Password",
            type: "password",
            componentProps: {
              labelClassName: "w-[150px]",
            },
          }),

          BottomTip,
        ]}
      />
    </div>
  </>
)

const BottomTip = () => {
  return (
    <div className="mt-6">
      <Divider />
      <p className="opacity-60">
        <small>Tip: Your sensitive data is stored locally and is not uploaded to the server.</small>
      </p>
    </div>
  )
}

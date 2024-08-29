import { createSetting } from "@renderer/atoms/settings/helper"
import {
  setIntegrationSetting,
  useIntegrationSettingValue,
} from "@renderer/atoms/settings/integration"
import {
  createDefaultSettings,
  setUISetting,
  useUISettingSelector,
} from "@renderer/atoms/settings/ui"
import { SimpleIconsEagle, SimpleIconsReadwise } from "@renderer/components/ui/platform-icon/icons"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@renderer/components/ui/select"
import { tipcClient } from "@renderer/lib/client"
import { useQuery } from "@tanstack/react-query"

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
            value: <span className="flex items-center gap-1"><SimpleIconsEagle />Eagle</span>,
          },
          defineSettingItem("enableEagle", {
            label: "Enable",
            description: <>Display <i>Save media to Eagle</i> button when available.</>,
          }),
          {
            type: "title",
            value: <span className="flex items-center gap-1"><SimpleIconsReadwise />Readwise</span>,
          },
          defineSettingItem("enableReadwise", {
            label: "Enable",
            description: <>Display <i>Save to Readwise</i> button when available.</>,
          }),
          defineSettingItem("readwiseToken", {
            label: "Readwise Access Token",
            description: <>You can get it here: <a target="_blank" className="underline" rel="noreferrer noopener" href="https://readwise.io/access_token">readwise.io/access_token</a>.</>,
          }),
        ]}
      />
    </div>
  </>
)

export const VoiceSelector = () => {
  const { data } = useQuery({
    queryFn: () => tipcClient?.getVoices(),
    queryKey: ["voices"],
  })
  const voice = useUISettingSelector((state) => state.voice)

  return (
    <div className="-mt-1 mb-3 flex items-center justify-between">
      <span className="shrink-0 text-sm font-medium">Voices</span>
      <Select
        defaultValue={createDefaultSettings().voice}
        value={voice}
        onValueChange={(value) => {
          setUISetting("voice", value)
        }}
      >
        <SelectTrigger size="sm" className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="h-64">
          {data?.map((item) => (
            <SelectItem key={item.ShortName} value={item.ShortName}>
              {item.FriendlyName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

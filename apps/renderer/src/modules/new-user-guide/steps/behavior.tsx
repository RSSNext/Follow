import { useState } from "react"

import { setGeneralSetting } from "~/atoms/settings/general"
import { Radio, RadioGroup } from "~/components/ui/radio-group"

type Behavior = "default" | "disabled" | ""

export function BehaviorGuide() {
  const [value, setValue] = useState<Behavior>("")

  const updateSettings = (behavior: Behavior) => {
    setGeneralSetting("hoverMarkUnread", behavior === "default")
    setGeneralSetting("scrollMarkUnread", behavior === "default")
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="my-6 text-xl font-semibold">How to mark entry as read?</h2>
        <div className="flex flex-col gap-4">
          <RadioGroup
            value={value}
            onValueChange={(value) => {
              setValue(value as Behavior)
              updateSettings(value as Behavior)
            }}
          >
            <Radio
              wrapperClassName="border rounded-lg p-4 has-[:checked]:bg-theme-accent-50 has-[:checked]:text-theme-accent-900 has-[:checked]:border-theme-accent-200"
              label="I don't really care about unread"
              value="default"
            />
            <Radio
              wrapperClassName="border rounded-lg p-4 has-[:checked]:bg-theme-accent-50 has-[:checked]:text-theme-accent-900 has-[:checked]:border-theme-accent-200"
              label="I want to completely control my unread"
              value="disabled"
            />
          </RadioGroup>
        </div>
      </div>
    </div>
  )
}

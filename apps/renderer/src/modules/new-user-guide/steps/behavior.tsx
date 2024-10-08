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
        <div className="flex flex-col gap-2">
          <RadioGroup
            value={value}
            onValueChange={(value) => {
              setValue(value as Behavior)
              updateSettings(value as Behavior)
            }}
          >
            <Radio label="I don't really care about unread" value="default" />
            <Radio label="I want to completely control my unread" value="disabled" />
          </RadioGroup>
        </div>
      </div>
    </div>
  )
}

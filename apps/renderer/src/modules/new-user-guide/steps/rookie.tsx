import { Radio, RadioGroup } from "~/components/ui/radio-group"

import { useHaveUsedOtherRSSReaderAtom } from "../atoms"

export function RookieCheck() {
  const [value, setValue] = useHaveUsedOtherRSSReaderAtom()

  return (
    <div className="space-y-4">
      <div>
        <h2 className="my-6 text-xl font-semibold">Have you used other RSS readers before?</h2>
        <div className="flex flex-col gap-4">
          <RadioGroup
            value={value ? "yes" : "no"}
            onValueChange={(value) => {
              setValue(value === "yes")
            }}
          >
            <Radio
              wrapperClassName="border rounded-lg p-4 has-[:checked]:bg-theme-accent-50 has-[:checked]:text-theme-accent-900 has-[:checked]:border-theme-accent-200"
              label="Yes, I have used other RSS readers"
              value="yes"
            />
            <Radio
              wrapperClassName="border rounded-lg p-4 has-[:checked]:bg-theme-accent-50 has-[:checked]:text-theme-accent-900 has-[:checked]:border-theme-accent-200"
              label="No, this is my first time using an RSS reader"
              value="no"
            />
          </RadioGroup>
        </div>
      </div>
    </div>
  )
}

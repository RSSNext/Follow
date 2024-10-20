import { RadioGroup } from "~/components/ui/radio-group"
import { RadioCard } from "~/components/ui/radio-group/RadioCard"

const radios = [
  {
    name: "1 Month",
    amount: 80,
  },
  {
    name: "3 Months",
    amount: 240,
  },
  {
    name: "6 Months",
    amount: 480,
  },
  {
    name: "1 Year",
    amount: 960,
  },
]

export const RadioCards = ({
  value,
  onValueChange,
}: {
  value: number
  onValueChange: (value: number) => void
}) => {
  return (
    <RadioGroup value={value.toString()} onValueChange={(value) => onValueChange(+value)}>
      <div className="grid w-full grid-cols-2 gap-2">
        {radios.map((item) => (
          <RadioCard
            key={item.name}
            wrapperClassName="justify-center"
            value={item.amount.toString()}
            label={
              <div>
                <h3 className="pr-3 font-medium leading-none">{item.name}</h3>
                <p className="mt-1 flex items-center justify-center gap-1 text-sm text-theme-vibrancyFg">
                  {item.amount}
                  <i className="i-mgc-power text-accent" />
                </p>
              </div>
            }
          />
        ))}
      </div>
    </RadioGroup>
  )
}

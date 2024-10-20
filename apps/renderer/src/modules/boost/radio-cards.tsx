import { RadioGroup } from "~/components/ui/radio-group"
import { RadioCard } from "~/components/ui/radio-group/RadioCard"

const radios = [
  {
    name: "1 Month",
    value: 1,
  },
  {
    name: "3 Months",
    value: 3,
  },
  {
    name: "6 Months",
    value: 6,
  },
  {
    name: "1 Year",
    value: 12,
  },
]

export const RadioCards = ({
  monthlyBoostCost,
  value,
  onValueChange,
}: {
  monthlyBoostCost: number
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
            value={(item.value * monthlyBoostCost).toString()}
            label={
              <div>
                <h3 className="pr-3 font-medium leading-none">{item.name}</h3>
                <p className="mt-1 flex items-center justify-center gap-1 text-sm text-theme-vibrancyFg">
                  {item.value * monthlyBoostCost}
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

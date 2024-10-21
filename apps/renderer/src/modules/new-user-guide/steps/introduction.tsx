import { Markdown } from "~/components/ui/markdown/Markdown"
import { cn } from "~/lib/utils"

type Feature = {
  title: string
  icon: string
  description: React.ReactNode
}

export function Introduction({ features }: { features: Feature[] }) {
  return (
    <div className="grid grid-cols-2">
      {features.map((feature, index) => (
        <div
          key={feature.title}
          className={cn(
            "border-dashed border-border p-2",
            index === 0
              ? "border-b border-r"
              : index === 1
                ? "border-b"
                : index === 2
                  ? "border-r"
                  : "",
          )}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center gap-2">
              <i className={cn(feature.icon, "size-[22px]")} />
              <h3 className="text-lg font-semibold">{feature.title}</h3>
            </div>
            {typeof feature.description === "string" ? (
              <Markdown>{feature.description}</Markdown>
            ) : (
              <div>{feature.description}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

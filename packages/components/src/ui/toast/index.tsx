import { useIsDark } from "@follow/hooks"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

export const Toaster = ({ ...props }: ToasterProps) => (
  <Sonner
    theme={useIsDark() ? "dark" : "light"}
    toastOptions={{
      className: tw`pointer-events-auto`,
      classNames: {
        content: "min-w-0",
      },
    }}
    {...props}
  />
)

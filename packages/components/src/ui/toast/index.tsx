import { useIsDark } from "@follow/hooks"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

export const Toaster = ({ ...props }: ToasterProps) => (
  <Sonner
    theme={useIsDark() ? "dark" : "light"}
    toastOptions={{
      className: tw`pointer-events-auto group`,
      classNames: {
        content: "min-w-0",
        icon: tw`self-start translate-y-[2px]`,
        closeButton: tw`!border-border bg-background transition-opacity hover:!bg-background will-change-opacity duration-200 opacity-0 group-hover:opacity-100`,
      },
    }}
    {...props}
  />
)

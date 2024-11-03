import { useIsDark } from "@follow/hooks"
import { Toaster as Sonner } from "sonner"

import { ZIndexProvider } from "../z-index"

type ToasterProps = React.ComponentProps<typeof Sonner>
const TOAST_Z_INDEX = 999999999
export const Toaster = ({ ...props }: ToasterProps) => (
  <ZIndexProvider zIndex={TOAST_Z_INDEX}>
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
  </ZIndexProvider>
)

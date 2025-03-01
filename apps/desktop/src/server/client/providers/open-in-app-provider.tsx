import { setOpenInAppDeeplink, useOpenInAppDeeplink } from "@client/atoms/app"
import { Button } from "@follow/components/ui/button/index.jsx"
import { useModalStack } from "rc-modal-sheet"
import type { FC } from "react"
import { useEffect } from "react"

export const OpenInAppDetector: FC = () => {
  const openInAppDeeplink = useOpenInAppDeeplink()

  const { present } = useModalStack()
  useEffect(() => {
    if (!openInAppDeeplink) return

    const props = {
      deeplink: openInAppDeeplink.deeplink,
      fallbackUrl: openInAppDeeplink.fallbackUrl,
    }
    present({
      title: "Open in app",
      content: () => <OpenInApp {...props} />,
    })
  }, [openInAppDeeplink, present])

  return null
}

const OpenInApp: FC<{
  deeplink: string
  fallbackUrl?: string
}> = ({ deeplink, fallbackUrl }) => {
  useEffect(() => {
    setOpenInAppDeeplink(null)
  }, [])
  return (
    <div className="max-w-[95vw] px-4">
      <p className="text-center">Do you need to open it in the App?</p>
      <div className="center mt-4 flex gap-2">
        {!!fallbackUrl && (
          <Button
            variant="outline"
            buttonClassName="shrink-0"
            onClick={() => {
              console.info("Continue in browser", fallbackUrl)
              window.location.href = fallbackUrl
            }}
          >
            Continue in Browser
          </Button>
        )}
        <Button
          buttonClassName="shrink-0"
          onClick={() => {
            window.location.href = deeplink
          }}
        >
          Open in App
        </Button>
      </div>
    </div>
  )
}

import { sendVerificationEmail } from "@follow/shared/auth"
import { WEB_URL } from "@follow/shared/constants"
import { cn } from "@follow/utils/utils"
import { lazy, Suspense, useEffect, useState } from "react"
import { toast } from "sonner"

import { useWhoami } from "~/atoms/user"
import { useAuthQuery } from "~/hooks/common/useBizQuery"
import { settings } from "~/queries/settings"

const LazyNewUserGuideModal = lazy(() =>
  import("~/modules/new-user-guide/modal").then((m) => ({ default: m.NewUserGuideModal })),
)

export function NewUserGuide() {
  const user = useWhoami()
  const { data: remoteSettings, isLoading } = useAuthQuery(settings.get(), {})
  const isNewUser =
    !isLoading && remoteSettings && Object.keys(remoteSettings.updated ?? {}).length === 0

  useEffect(() => {
    if (user?.email && !user.emailVerified) {
      toast.error(<EmailVerificationToast user={user} />, {
        duration: Infinity,
      })
    }
  }, [user?.emailVerified])

  return user && isNewUser ? (
    <Suspense>
      <LazyNewUserGuideModal />
    </Suspense>
  ) : null
}

function EmailVerificationToast({
  user,
}: {
  user: {
    email: string
  }
}) {
  const [isEmailVerificationSent, setIsEmailVerificationSent] = useState(false)
  return (
    <div data-content className="flex w-full flex-col gap-2">
      <div data-title>Please verify your email ({user.email}) to continue</div>
      <button
        type="button"
        data-button="true"
        data-action="true"
        className={cn(
          "font-sans font-medium",
          isEmailVerificationSent && "!cursor-progress opacity-50",
        )}
        disabled={isEmailVerificationSent}
        onClick={() => {
          sendVerificationEmail({
            email: user.email,
            callbackURL: `${WEB_URL}/login`,
          })
          setIsEmailVerificationSent(true)
        }}
      >
        Send verification email
      </button>
    </div>
  )
}

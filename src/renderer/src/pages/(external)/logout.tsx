import { PoweredByFooter } from "@renderer/components/common/PoweredByFooter"
import { LoadingCircle } from "@renderer/components/ui/loading"
import { useSignOut } from "@renderer/hooks/biz/useSignOut"
import { useSession } from "@renderer/queries/auth"
import { useEffect } from "react"

function SignOutComponent() {
  const signOut = useSignOut()
  useEffect(() => {
    signOut()
  }, [signOut])

  return <LoadingCircle size="medium" />
}

function SignOutMain() {
  const { status } = useSession()

  if (status === "error") {
    return null
  }

  if (status === "loading") {
    return <LoadingCircle size="medium" />
  }

  if (status === "unauthenticated") {
    return (
      <p className="text-balance text-center text-2xl">
        You have successfully logged out, please close this page.
      </p>
    )
  }

  return <SignOutComponent />
}

export function Component() {
  return (
    <SignOutLayout>
      <SignOutMain />
    </SignOutLayout>
  )
}

function SignOutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-10 px-4 pb-12 pt-[30vh]">
      {children}
      <div className="grow" />
      <PoweredByFooter />
    </div>
  )
}

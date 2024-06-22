import { Logo } from "@renderer/components/icons/logo"
import { StyledButton } from "@renderer/components/ui/button"
import { UserAvatar } from "@renderer/components/user-button"
import { apiClient } from "@renderer/lib/api-fetch"
import { APP_NAME } from "@renderer/lib/constants"
import { DEEPLINK_SCHEME } from "@shared/constants"
import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"

export function Component() {
  const navigate = useNavigate()

  const getCallbackUrl = async () => {
    const { data } = await apiClient["auth-app"]["new-session"].$post({})
    return `${DEEPLINK_SCHEME}auth?token=${data.sessionToken}`
  }

  const onceRef = useRef(false)
  useEffect(() => {
    if (onceRef.current) return
    onceRef.current = true
    if (window.electron) {
      navigate("/")
    } else {
      getCallbackUrl().then((url) => {
        window.open(url)
      })
    }
  }, [])

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-10">
      <Logo className="size-20" />
      <UserAvatar className="bg-stone-100 px-10 py-4 text-2xl" />
      <h1 className="text-3xl font-bold">
        Successfully connected to
        {" "}
        {APP_NAME}
        {" "}
        Account
      </h1>
      <h2>
        You have successfully connected to
        {" "}
        {APP_NAME}
        {" "}
        Account. Now is the time
        to open
        {" "}
        {APP_NAME}
        {" "}
        and safely close this page.
      </h2>
      <div className="center flex gap-4">
        <StyledButton
          variant="plain"
          className="h-14 border-transparent px-10 text-base"
          onClick={() => navigate("/")}
        >
          Continue in Browser
        </StyledButton>

        <StyledButton
          className="h-14 !rounded-full px-10 text-lg"
          onClick={async () => window.open(await getCallbackUrl())}
        >
          Open
          {" "}
          {APP_NAME}
        </StyledButton>
      </div>
    </div>
  )
}

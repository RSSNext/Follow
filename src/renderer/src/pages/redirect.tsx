import { Button } from "@renderer/components/ui/button"
import { UserButton } from "@renderer/components/user-button"
import { getCsrfToken, authConfigManager } from "@hono/auth-js/react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export function Component() {
  const navigate = useNavigate()

  const getCallbackUrl = async () => {
    const response = await (
      await fetch(
        `${authConfigManager.getConfig().baseUrl}/auth-app/new-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            csrfToken: await getCsrfToken(),
          }),
        },
      )
    ).json()
    return `follow://auth?token=${response.data.sessionToken}`
  }

  useEffect(() => {
    if (window.electron) {
      navigate("/")
    } else {
      getCallbackUrl().then((url) => window.open(url))
    }
  }, [])

  return (
    <div className="h-screen w-full flex items-center justify-center flex-col gap-10">
      <img src="./icon.svg" alt="logo" className="h-20 w-20" />
      <UserButton className="text-2xl bg-stone-100 px-10 py-4" />
      <h1 className="text-3xl font-bold">
        Successfully connected to Follow Account
      </h1>
      <h2>
        You have successfully connected to Follow Account. Now is the time to
        open Follow and safely close this page.
      </h2>
      <Button
        className="text-lg"
        size="xl"
        onClick={async () => window.open(await getCallbackUrl())}
      >
        Open Follow
      </Button>
    </div>
  )
}

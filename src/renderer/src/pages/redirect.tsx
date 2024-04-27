import { Button } from "@renderer/components/ui/button"
import { UserButton } from "@renderer/components/user-button"
import { getCsrfToken, authConfigManager } from "@hono/auth-js/react"

export function Component() {
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
    return `readok://auth?token=${response.data.sessionToken}`
  }

  return (
    <div className="h-screen w-full flex items-center justify-center flex-col gap-10">
      <UserButton className="text-2xl bg-stone-100 px-10 py-4" />
      <h1 className="text-3xl font-bold">
        Successfully connected to ReadOK Account
      </h1>
      <h2>
        You have successfully connected to ReadOK Account. Now is the time to
        open ReadOK and safely close this page.
      </h2>
      <Button
        className="text-lg"
        size="xl"
        onClick={async () => window.open(await getCallbackUrl())}
      >
        Open ReadOK
      </Button>
    </div>
  )
}

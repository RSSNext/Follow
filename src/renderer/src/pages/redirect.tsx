import { Button } from "@renderer/components/ui/button"
import { UserButton } from "@renderer/components/user-button"
import { apiFetch } from "@renderer/lib/queries/api-fetch"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export function Component() {
  const navigate = useNavigate()

  const getCallbackUrl = async () => {
    const { data } = await apiFetch<{
      data: {
        sessionToken: string
      }
    }>("/auth-app/new-session", {
      method: "POST",
    })
    return `follow://auth?token=${data.sessionToken}`
  }

  useEffect(() => {
    if (window.electron) {
      navigate("/")
    } else {
      getCallbackUrl().then((url) => window.open(url))
    }
  }, [])

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-10">
      <img src="./icon.svg" alt="logo" className="size-20" />
      <UserButton className="bg-stone-100 px-10 py-4 text-2xl" />
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

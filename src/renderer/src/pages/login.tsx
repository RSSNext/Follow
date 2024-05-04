import { Button } from "@renderer/components/ui/button"
import { signIn } from "@hono/auth-js/react"

export function Component() {
  const callbackUrl = `${import.meta.env.VITE_ELECTRON_REMOTE_URL}/redirect?app=follow`

  return (
    <div className="h-screen w-full flex items-center justify-center flex-col gap-10">
      <img src="./icon.svg" alt="logo" className="h-20 w-20" />
      <h1 className="text-3xl font-bold">Log in to Follow</h1>
      <div className="flex flex-col gap-3">
        <Button
          className="text-lg"
          size="xl"
          onClick={() =>
            signIn("github", {
              callbackUrl,
            })
          }
        >
          <i className="i-mingcute-github-fill mr-2 text-xl" /> Continue with
          GitHub
        </Button>
        <Button
          className="text-lg bg-blue-500 hover:bg-blue-500/90"
          size="xl"
          onClick={() =>
            signIn("google", {
              callbackUrl,
            })
          }
        >
          <i className="i-mingcute-google-fill mr-2 text-xl" /> Continue with
          Google
        </Button>
      </div>
    </div>
  )
}

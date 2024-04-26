import { Button } from "@renderer/components/ui/button"
import { signIn } from "@hono/auth-js/react"

export function Component() {
  return (
    <div className="h-screen w-full flex items-center justify-center flex-col gap-10">
      <h1 className="text-3xl font-bold">Log in to ReadOK</h1>
      <div className="flex flex-col gap-3">
        <Button
          className="text-lg"
          size="xl"
          type="submit"
          onClick={() =>
            signIn("github", {
              redirectUrl: `${import.meta.env.VITE_ELECTRON_REMOTE_URL}/login`,
            })
          }
        >
          <i className="i-mingcute-github-fill mr-2 text-xl" /> Continue with
          GitHub
        </Button>
        <Button className="text-lg bg-blue-500 hover:bg-blue-500/90" size="xl">
          <i className="i-mingcute-google-fill mr-2 text-xl" /> Continue with
          Google
        </Button>
      </div>
    </div>
  )
}

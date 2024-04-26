import { Button } from "@renderer/components/ui/button"
import { UserButton } from "@renderer/components/user-button"

export function Component() {
  const app = new URLSearchParams(window.location.search).get("app")
  console.log(app)

  return (
    <div className="h-screen w-full flex items-center justify-center flex-col gap-10">
      <UserButton />
      <h1 className="text-3xl font-bold">
        Successfully connected to ReadOK Account
      </h1>
      <h2>
        You have successfully connected to ReadOK Account. Now is the time to
        open ReadOK and safely close this page.
      </h2>
      <div className="flex flex-col gap-3">
        <Button className="text-lg" size="xl">
          Open ReadOK
        </Button>
      </div>
    </div>
  )
}

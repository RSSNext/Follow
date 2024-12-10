import { UserAvatar } from "@client/components/ui/user-avatar"
import { queryClient } from "@client/lib/query-client"
import { useSession } from "@client/query/auth"
import { useAuthProviders } from "@client/query/users"
import { Logo } from "@follow/components/icons/logo.jsx"
import { Button } from "@follow/components/ui/button/index.js"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@follow/components/ui/form/index.jsx"
import { Input } from "@follow/components/ui/input/index.js"
import { authProvidersConfig } from "@follow/constants"
import { createSession, loginHandler, signOut } from "@follow/shared/auth"
import { DEEPLINK_SCHEME } from "@follow/shared/constants"
import { cn } from "@follow/utils/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useCallback, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useLocation } from "react-router"
import { toast } from "sonner"
import { z } from "zod"

export function Component() {
  return <Login />
}

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
})

async function onSubmit(values: z.infer<typeof formSchema>) {
  const res = await loginHandler("credential", values)
  if (res?.error) {
    toast.error(res.error.message)
    return
  }
  queryClient.invalidateQueries({ queryKey: ["auth", "session"] })
}

function LoginWithPassword() {
  const { t } = useTranslation("external")
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  return (
    <div className="mt-4 space-y-2">
      <p className="text-center text-sm text-muted-foreground">{t("login.or")}</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="email" placeholder={t("login.email")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="password" placeholder={t("login.password")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" variant="outline" className="w-full">
            {t("login.logIn")}
          </Button>
        </form>
      </Form>
    </div>
  )
}

function Login() {
  const { status, refetch } = useSession()

  const [redirecting, setRedirecting] = useState(false)

  const { data: authProviders } = useAuthProviders()
  const location = useLocation()
  const urlParams = new URLSearchParams(location.search)
  const provider = urlParams.get("provider")

  const isAuthenticated = status === "authenticated"

  const { t } = useTranslation("external")

  useEffect(() => {
    if (provider && provider !== "credential" && status === "unauthenticated") {
      loginHandler(provider)
      setRedirecting(true)
    }
  }, [provider, status])

  const getCallbackUrl = useCallback(async () => {
    const { data } = await createSession()
    if (!data) return null
    return {
      url: `${DEEPLINK_SCHEME}auth?ck=${data.ck}&userId=${data.userId}`,
      userId: data.userId,
    }
  }, [])

  const handleOpenApp = useCallback(async () => {
    const callbackUrl = await getCallbackUrl()
    if (!callbackUrl) return
    window.open(callbackUrl.url, "_top")
  }, [getCallbackUrl])

  const onceRef = useRef(false)
  useEffect(() => {
    if (isAuthenticated && !onceRef.current) {
      handleOpenApp()
    }
    onceRef.current = true
  }, [handleOpenApp, isAuthenticated])

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-10">
      <Logo className="size-20" />
      {!isAuthenticated && (
        <h1 className="text-3xl font-bold">
          {t("login.logInTo")}
          {` ${APP_NAME}`}
        </h1>
      )}
      {redirecting ? (
        <div>{t("login.redirecting")}</div>
      ) : (
        <div className="flex flex-col gap-3">
          {isAuthenticated ? (
            <div className="flex w-full flex-col items-center justify-center gap-10 px-4">
              <div className="relative flex items-center justify-center">
                <UserAvatar className="gap-4 px-10 py-4 text-2xl" />
                <div className="absolute right-0">
                  <Button
                    variant="ghost"
                    onClick={async () => {
                      await signOut()
                      await refetch()
                    }}
                  >
                    <i className="i-mingcute-exit-line text-xl" />
                  </Button>
                </div>
              </div>
              <h2 className="text-center">
                {t("redirect.successMessage", { app_name: APP_NAME })} <br />
                <br />
                {t("redirect.instruction", { app_name: APP_NAME })}
              </h2>
              <div className="center flex flex-col gap-20 sm:flex-row">
                <Button
                  variant="text"
                  className="h-14 text-base"
                  onClick={() => {
                    window.location.href = "/"
                  }}
                >
                  {t("redirect.continueInBrowser")}
                </Button>

                <Button className="h-14 !rounded-full px-5 text-lg" onClick={handleOpenApp}>
                  {t("redirect.openApp", { app_name: APP_NAME })}
                </Button>
              </div>
            </div>
          ) : (
            <>
              {Object.entries(authProviders || []).map(([key, provider]) => (
                <Button
                  key={key}
                  buttonClassName={cn(
                    "h-[48px] w-[320px] rounded-[8px] font-sans text-base text-white hover:!bg-black/80 focus:!border-black/80 focus:!ring-black/80",
                    authProvidersConfig[key]?.buttonClassName,
                  )}
                  onClick={() => {
                    loginHandler(key)
                  }}
                >
                  <i className={cn("mr-2 text-xl", authProvidersConfig[key].iconClassName)} />{" "}
                  {t("login.continueWith", { provider: provider.name })}
                </Button>
              ))}
              <LoginWithPassword />
            </>
          )}
        </div>
      )}
    </div>
  )
}

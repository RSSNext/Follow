import { zodResolver } from "@hookform/resolvers/zod"
import { Logo } from "@renderer/components/icons/logo"
import { Button } from "@renderer/components/ui/button"
import { styledButtonVariant } from "@renderer/components/ui/button/variants"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@renderer/components/ui/form"
import { Input } from "@renderer/components/ui/input"
import { SocialMediaLinks } from "@renderer/constants/social"
import { getFetchErrorMessage } from "@renderer/lib/api-fetch"
import { useInvitationMutation } from "@renderer/queries/invitations"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { z } from "zod"

const formSchema = z.object({
  code: z.string().min(1),
})

export function Component() {
  const navigate = useNavigate()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })
  const invitationMutation = useInvitationMutation({
    onError(error) {
      const message = getFetchErrorMessage(error)
      form.setError("code", { message })
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    invitationMutation.mutate(values.code)
  }

  useEffect(() => {
    if (invitationMutation.isSuccess) {
      navigate("/")
    }
  }, [invitationMutation.isSuccess, navigate])

  return (
    <div className="container flex h-screen w-full flex-col items-center justify-center gap-14">
      <Logo className="size-20" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-[512px] max-w-full">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center gap-2 md:block">
                <FormLabel>Invitation Code</FormLabel>
                <FormControl>
                  <Input autoFocus {...field} />
                </FormControl>
                <div className="h-6">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <div className="center flex">
            <Button
              type="submit"
              disabled={!form.formState.isValid}
              isLoading={invitationMutation.isPending}
            >
              Activate
            </Button>
          </div>
        </form>
      </Form>
      <div className="space-y-2 text-balance text-center text-sm text-zinc-600 md:text-left">
        <p>
          😰 Sorry, Follow is currently in <strong>early access</strong> and requires an invitation
          code to use.
        </p>
        <p>You can get an invitation code in the following ways:</p>
        <p>
          <p>1. Looking for any beta user to invite you.</p>
          <p>2. Join our Discord server for occasional giveaways.</p>
          <p>3. Follow our X account for occasional giveaways.</p>
        </p>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {SocialMediaLinks.map((link) => (
          <span
            key={link.url}
            className={styledButtonVariant({
              variant: "outline",
              className: "flex-1",
            })}
          >
            <a
              href={link.url}
              className="center flex w-full gap-1"
              target="_blank"
              rel="noreferrer"
            >
              <i className={link.icon} />
              {link.label}
            </a>
          </span>
        ))}
      </div>
    </div>
  )
}

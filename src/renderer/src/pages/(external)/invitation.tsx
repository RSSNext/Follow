import { zodResolver } from "@hookform/resolvers/zod"
import { Logo } from "@renderer/components/icons/logo"
import { Button } from "@renderer/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@renderer/components/ui/form"
import { Input } from "@renderer/components/ui/input"
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
    <div className="container flex h-screen w-full flex-col items-center justify-center gap-10">
      <Logo className="size-20" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-[512px] max-w-full space-y-8"
        >
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
      <div className="text-balance text-center text-sm text-zinc-500 md:text-left">
        😰 Sorry, Follow is currently in
        {" "}
        <strong>early access</strong>
        {" "}
        and
        requires an invitation to use.
      </div>
    </div>
  )
}

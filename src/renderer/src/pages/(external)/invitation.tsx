import { zodResolver } from "@hookform/resolvers/zod"
import { Logo } from "@renderer/components/icons/logo"
import { StyledButton } from "@renderer/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@renderer/components/ui/form"
import { Input } from "@renderer/components/ui/input"
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
  const invitationMutation = useInvitationMutation()

  function onSubmit(values: z.infer<typeof formSchema>) {
    invitationMutation.mutate(values.code)
  }

  useEffect(() => {
    if (invitationMutation.isSuccess) {
      navigate("/")
    }
  })

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-10 px-10">
      <Logo className="size-20" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-[512px] space-y-8"
        >
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invitation Code</FormLabel>
                <FormControl>
                  <Input autoFocus {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="center flex">
            <StyledButton type="submit" isLoading={invitationMutation.isPending}>
              Active
            </StyledButton>
          </div>
        </form>
      </Form>
      <div className="text-sm text-zinc-500">
        😰 Sorry, Follow is currently in
        {" "}
        <strong>early access</strong>
        {" "}
        and requires an invitation to use.
      </div>
    </div>
  )
}

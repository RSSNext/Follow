import { useSession } from "@hono/auth-js/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { SettingsTitle } from "@renderer/components/settings/title"
import { Button } from "@renderer/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@renderer/components/ui/form"
import { Input } from "@renderer/components/ui/input"
import { useToast } from "@renderer/components/ui/use-toast"
import { apiClient } from "@renderer/lib/api-fetch"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  handle: z.string().max(50),
  name: z.string().min(3).max(50),
  avatar: z.string().url(),
})

export function Component() {
  const { data: session } = useSession()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      handle: session?.user?.handle || "",
      name: session?.user?.name || "",
      avatar: session?.user?.image || "",
    },
  })

  const { toast } = useToast()

  const updateMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) =>
      apiClient["auth-app"]["update-account"].$patch({
        json: values,
      }),
    onSuccess: () => {
      toast({
        duration: 3000,
        description: "Profile updated.",
      })
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateMutation.mutate(values)
  }

  return (
    <>
      <SettingsTitle path="profile" className="mb-4" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="handle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Handle</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>Your unique identifier.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>Your public display name.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="avatar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avatar</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  )
}

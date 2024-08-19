import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@renderer/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@renderer/components/ui/form"
import { Input } from "@renderer/components/ui/input"
import { useCurrentModal } from "@renderer/components/ui/modal"
import { apiClient } from "@renderer/lib/api-fetch"
import { Queries } from "@renderer/queries"
import { useMutation } from "@tanstack/react-query"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  category: z.string(),
})

export function CategoryRenameContent({
  feedIdList,
  onSuccess,
  category,
  view,
}: {
  feedIdList: string[]
  onSuccess?: () => void
  category: string
  view?: number
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category,
    },
  })

  const renameMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) =>
      apiClient.categories.$patch({
        json: {
          feedIdList,
          category: values.category,
        },
      }),
    onSuccess: () => {
      Queries.subscription.byView(view).invalidate()

      onSuccess?.()
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    renameMutation.mutate(values)
  }

  const { setClickOutSideToDismiss } = useCurrentModal()

  useEffect(() => {
    setClickOutSideToDismiss(!form.formState.isDirty)
  }, [form.formState.isDirty])
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" isLoading={renameMutation.isPending}>
            Rename
          </Button>
        </div>
      </form>
    </Form>
  )
}

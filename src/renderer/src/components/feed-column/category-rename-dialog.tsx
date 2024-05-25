import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@renderer/components/ui/button"
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@renderer/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@renderer/components/ui/form"
import { Input } from "@renderer/components/ui/input"
import { apiFetch } from "@renderer/queries/api-fetch"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  category: z.string(),
})

export function CategoryRenameDialog({
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

  const queryClient = useQueryClient()
  const renameMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) =>
      apiFetch("/categories", {
        method: "PATCH",
        body: {
          feedIdList,
          category: values.category,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["subscriptions", view],
      })
      onSuccess?.()
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("onSubmit", values)
    renameMutation.mutate(values)
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Rename Category</DialogTitle>
      </DialogHeader>
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
          <Button type="submit" isLoading={renameMutation.isPending}>
            Rename
          </Button>
        </form>
      </Form>
    </DialogContent>
  )
}

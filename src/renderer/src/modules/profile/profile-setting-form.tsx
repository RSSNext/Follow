import { zodResolver } from "@hookform/resolvers/zod"
import { setWhoami, useWhoami } from "@renderer/atoms/user"
import { Avatar, AvatarImage } from "@renderer/components/ui/avatar"
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
import { apiClient } from "@renderer/lib/api-fetch"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { z } from "zod"

const formSchema = z.object({
  handle: z.string().max(50),
  name: z.string().min(3).max(50),
  image: z.string().url(),
})

export const ProfileSettingForm = () => {
  const { t } = useTranslation()
  const user = useWhoami()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      handle: user?.handle || "",
      name: user?.name || "",
      image: user?.image || "",
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) =>
      apiClient["auth-app"]["update-account"].$patch({
        json: values,
      }),
    onSuccess: (_, variables) => {
      if (user && variables) {
        setWhoami({ ...user, ...variables })
      }
      toast(t("settings.profile.updateSuccess"), {
        duration: 3000,
      })
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateMutation.mutate(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
        <FormField
          control={form.control}
          name="handle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("settings.profile.handle.label")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>{t("settings.profile.handle.description")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("settings.profile.name.label")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>{t("settings.profile.name.description")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <div className="flex gap-4">
              <FormItem className="w-full">
                <FormLabel>{t("settings.profile.avatar.label")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>

              <Avatar className="-translate-y-2 self-end">
                <AvatarImage src={field.value} />
              </Avatar>
            </div>
          )}
        />

        <div className="text-right">
          <Button type="submit" isLoading={updateMutation.isPending}>
            {t("settings.profile.submit")}
          </Button>
        </div>
      </form>
    </Form>
  )
}

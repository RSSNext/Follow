import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { z } from "zod"

import { setWhoami, useWhoami } from "~/atoms/user"
import { Avatar, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { apiClient } from "~/lib/api-fetch"
import { toastFetchError } from "~/lib/error-parser"
import { cn } from "~/lib/utils"

const formSchema = z.object({
  handle: z.string().max(50),
  name: z.string().min(3).max(50),
  image: z.string().url(),
})

export const ProfileSettingForm = ({
  className,
  buttonClassName,
}: {
  className?: string
  buttonClassName?: string
}) => {
  const { t } = useTranslation("settings")
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
    onError: (error) => {
      toastFetchError(error)
    },
    onSuccess: (_, variables) => {
      if (user && variables) {
        setWhoami({ ...user, ...variables })
      }
      toast(t("profile.updateSuccess"), {
        duration: 3000,
      })
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateMutation.mutate(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("mt-4 space-y-4", className)}>
        <FormField
          control={form.control}
          name="handle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("profile.handle.label")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>{t("profile.handle.description")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("profile.name.label")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>{t("profile.name.description")}</FormDescription>
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
                <FormLabel>{t("profile.avatar.label")}</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-4">
                    <Input {...field} />
                    {field.value && (
                      <Avatar className="size-9">
                        <AvatarImage src={field.value} />
                      </Avatar>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
          )}
        />

        <div className={cn("text-right", buttonClassName)}>
          <Button type="submit" isLoading={updateMutation.isPending}>
            {t("profile.submit")}
          </Button>
        </div>
      </form>
    </Form>
  )
}

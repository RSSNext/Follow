import { Avatar, AvatarImage } from "@follow/components/ui/avatar/index.jsx"
import { Button } from "@follow/components/ui/button/index.js"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@follow/components/ui/form/index.jsx"
import { Input } from "@follow/components/ui/input/index.js"
import { Label } from "@follow/components/ui/label/index.js"
import { sendVerificationEmail, updateUser } from "@follow/shared/auth"
import { cn } from "@follow/utils/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { z } from "zod"

import { setWhoami, useWhoami } from "~/atoms/user"
import { CopyButton } from "~/components/ui/code-highlighter"
import { toastFetchError } from "~/lib/error-parser"

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
    mutationFn: (values: z.infer<typeof formSchema>) =>
      updateUser({
        handle: values.handle,
        image: values.image,
        name: values.name,
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

  const verifyEmailMutation = useMutation({
    mutationFn: async () => {
      if (!user?.email) return
      return sendVerificationEmail({
        email: user.email,
      })
    },
    onSuccess: () => {
      toast.success(t("profile.email.verification_sent"))
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    updateMutation.mutate(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("mt-4 space-y-4", className)}>
        <div className="space-y-2">
          <Label>{t("profile.email.label")}</Label>
          <p className="group flex gap-2 text-sm text-muted-foreground">
            {user?.email}

            {user?.email && (
              <CopyButton
                value={user.email}
                className="size-5 p-1 opacity-0 duration-300 group-hover:opacity-100"
              />
            )}
            <span className={cn(user?.emailVerified ? "text-green-500" : "text-red-500")}>
              {user?.emailVerified ? t("profile.email.verified") : t("profile.email.unverified")}
            </span>
          </p>
          {!user?.emailVerified && (
            <Button
              variant="outline"
              type="button"
              isLoading={verifyEmailMutation.isPending}
              onClick={() => {
                verifyEmailMutation.mutate()
              }}
            >
              {t("profile.email.send_verification")}
            </Button>
          )}
        </div>
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

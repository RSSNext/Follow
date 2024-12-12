import { Button } from "@follow/components/ui/button/index.jsx"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@follow/components/ui/card/index.jsx"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@follow/components/ui/form/index.jsx"
import { Input } from "@follow/components/ui/input/index.js"
import { resetPassword } from "@follow/shared/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import { z } from "zod"

const passwordSchema = z.string().min(8).max(128)
const initPasswordFormSchema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export function Component() {
  const { t } = useTranslation("external")
  const form = useForm<z.infer<typeof initPasswordFormSchema>>({
    resolver: zodResolver(initPasswordFormSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (values: z.infer<typeof initPasswordFormSchema>) => {
      const res = await resetPassword({ newPassword: values.newPassword })
      const error = res.error?.message
      if (error) {
        throw new Error(error)
      }
    },
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: () => {
      toast.success(t("login.reset_password.success"))
    },
  })

  function onSubmit(values: z.infer<typeof initPasswordFormSchema>) {
    updateMutation.mutate(values)
  }

  return (
    <div className="flex h-full items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>{t("login.reset_password.label")}</CardTitle>
          <CardDescription>{t("login.reset_password.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={t("login.new_password.label")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={t("login.confirm_password.label")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="text-right">
                <Button type="submit" isLoading={updateMutation.isPending}>
                  {t("login.submit")}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

import { Button } from "@follow/components/ui/button/index.js"
import { Label } from "@follow/components/ui/label/index.js"
import { deleteUser } from "@follow/shared/auth"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"

import { useModalStack } from "~/components/ui/modal/stacked/hooks"
import { useHasPassword } from "~/queries/auth"

import { NoPasswordHint, PasswordForm } from "./shared"

export const DeleteUser = () => {
  const { t } = useTranslation("settings")
  const { data: hasPassword, isLoading } = useHasPassword()
  const { present } = useModalStack()
  return (
    <div className="flex items-center justify-between">
      <Label>{t("profile.delete_account.label")}</Label>
      {isLoading ? null : hasPassword ? (
        <Button
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          onClick={() => {
            present({
              title: t("profile.delete_account.label"),
              content: () => (
                <PasswordForm
                  onSubmitMutationFn={async (values) => {
                    const res = await deleteUser({ password: values.password })
                    if (res.error) {
                      throw new Error(res.error.message)
                    }
                    toast.success(t("profile.delete_account.email_sent"))
                  }}
                />
              ),
            })
          }}
        >
          {t("profile.delete_account.action")}
        </Button>
      ) : (
        <NoPasswordHint i18nKey="profile.delete_account.no_password" />
      )}
    </div>
  )
}

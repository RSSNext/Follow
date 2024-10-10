import type { FC } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import { LoginModalContent } from "~/modules/auth/LoginModalContent"

import { UserArrowLeftIcon } from "../../components/icons/user"
import { ActionButton } from "../../components/ui/button"
import { PlainModal } from "../../components/ui/modal/stacked/custom-modal"
import { useModalStack } from "../../components/ui/modal/stacked/hooks"

export interface LoginProps {
  method?: "redirect" | "modal"
}
export const LoginButton: FC<LoginProps> = (props) => {
  const { method } = props
  const modalStack = useModalStack()
  const { t } = useTranslation()
  const Content = (
    <ActionButton
      className="relative z-[1]"
      onClick={
        method === "modal"
          ? () => {
              modalStack.present({
                CustomModalComponent: PlainModal,
                title: "Login",
                id: "login",
                content: () => <LoginModalContent runtime={window.electron ? "app" : "browser"} />,
                clickOutsideToDismiss: true,
              })
            }
          : undefined
      }
      tooltip={t("words.login")}
    >
      <UserArrowLeftIcon className="size-4" />
    </ActionButton>
  )
  return method === "modal" ? Content : <Link to="/login">{Content}</Link>
}

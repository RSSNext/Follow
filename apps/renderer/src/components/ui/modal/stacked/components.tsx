import { useTranslation } from "react-i18next"

import { MotionButtonBase } from "../../button"
import { useCurrentModal } from "./hooks"

export const ModalClose = () => {
  const { dismiss } = useCurrentModal()
  const { t } = useTranslation("common")

  return (
    <MotionButtonBase
      aria-label={t("close")}
      className="absolute right-6 top-6 z-[99] flex size-8 items-center justify-center rounded-md duration-200 hover:bg-theme-button-hover"
      onClick={dismiss}
    >
      <i className="i-mgc-close-cute-re block" />
    </MotionButtonBase>
  )
}

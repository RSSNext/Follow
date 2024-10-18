import { useCallback } from "react"
import { useTranslation } from "react-i18next"

import { Button } from "~/components/ui/button"
import { stopPropagation } from "~/lib/dom"

import { useActivationModal } from "."

export const NeedActivationToast = (props: { dimiss: () => void }) => {
  const presentActivationModal = useActivationModal()

  const { t } = useTranslation()
  return (
    <div className="flex flex-col justify-end">
      <div>{t("activation.description")}</div>

      <div className="text-right">
        <Button
          // Prevent modal dismiss
          onPointerDown={stopPropagation}
          onClick={useCallback(() => {
            presentActivationModal()
            props.dimiss()
          }, [presentActivationModal, props])}
          buttonClassName="text-xs"
        >
          {t("activation.activate")}
        </Button>
      </div>
    </div>
  )
}

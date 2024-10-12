import { PlainModal } from "~/components/ui/modal/stacked/custom-modal"
import { DeclarativeModal } from "~/components/ui/modal/stacked/declarative-modal"
import { RootPortal } from "~/components/ui/portal"

import { GuideModalContent } from "./guide-modal-content"

export const NewUserGuideModal = () => {
  return (
    <RootPortal>
      <DeclarativeModal
        id="new-user-guide"
        title="New User Guide"
        CustomModalComponent={PlainModal}
        modalContainerClassName="flex items-center justify-center"
        open
        canClose={false}
        clickOutsideToDismiss={false}
      >
        <GuideModalContent />
      </DeclarativeModal>
    </RootPortal>
  )
}

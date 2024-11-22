import { LOGO_MOBILE_ID } from "~/constants/dom"
import { EntryColumn } from "~/modules/entry-column"

import { MobileFloatBar } from "../feed-column/float-bar.mobile"

export const EntryColumnMobile = () => {
  return (
    <div className="flex h-screen min-w-0 grow">
      <EntryColumn />

      <MobileFloatBar
        scrollContainer={null}
        onLogoClick={() => {
          ;(document.querySelector(`#${LOGO_MOBILE_ID}`) as HTMLElement)?.click()
        }}
      />
    </div>
  )
}

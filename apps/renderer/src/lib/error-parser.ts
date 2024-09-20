import { t } from "i18next"
import { FetchError } from "ofetch"
import { createElement } from "react"
import { toast } from "sonner"

import { CopyButton } from "~/components/ui/code-highlighter"
import { Markdown } from "~/components/ui/markdown"

export const getFetchErrorMessage = (error: Error) => {
  if (error instanceof FetchError) {
    try {
      const json = JSON.parse(error.response?._data)

      const { reason, code, message } = json
      const i18nKey = `errors:${code}` as any
      const i18nMessage = t(i18nKey) === i18nKey ? message : t(i18nKey)
      return `${i18nMessage}${reason ? `: ${reason}` : ""}`
    } catch {
      return error.message
    }
  }

  return error.message
}
export const toastFetchError = (error: Error) => {
  let message = ""
  let _reason = ""
  if (error instanceof FetchError) {
    try {
      const json = JSON.parse(error.response?._data)

      const { reason, code, message: _message } = json
      const i18nKey = `errors:${code}` as any
      const i18nMessage = t(i18nKey) === i18nKey ? message : t(i18nKey)

      message = i18nMessage

      if (reason) {
        _reason = reason
      }
    } catch {
      message = error.message
    }
  }

  if (!_reason) {
    return toast.error(message)
  } else {
    return toast.error(message, {
      duration: 5000,

      description: createElement(
        "div",
        {
          className: "min-w-0 flex relative",
        },
        [
          createElement(CopyButton, {
            className: "absolute right-0 top-0 z-[1]",
            key: "copy",
            value: _reason,
          }),
          createElement(Markdown, {
            key: "reason",
            className: "text-sm opacity-70 min-w-0",
            children: _reason,
          }),
        ],
      ),
    })
  }
}

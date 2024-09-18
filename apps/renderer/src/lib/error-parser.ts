import { CopyButton } from "@renderer/components/ui/code-highlighter"
import { Markdown } from "@renderer/components/ui/markdown"
import { FetchError } from "ofetch"
import { createElement } from "react"
import { toast } from "sonner"

export const getFetchErrorMessage = (error: Error) => {
  if (error instanceof FetchError) {
    try {
      const json = JSON.parse(error.response?._data)
      // TODO get the biz code to show the error message, and for i18n
      // const bizCode = json.code
      const { reason } = json
      return `${json.message || error.message}${reason ? `: ${reason}` : ""}`
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

      // TODO get the biz code to show the error message, and for i18n
      // const bizCode = json.code
      const { reason } = json

      message = json.message || error.message

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

import { cn } from "@follow/utils/utils"
import { t } from "i18next"
import { FetchError } from "ofetch"
import { createElement } from "react"
import type { ExternalToast } from "sonner"
import { toast } from "sonner"

import { CopyButton } from "~/components/ui/code-highlighter"
import { Markdown } from "~/components/ui/markdown/Markdown"

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

/**
 * Just a wrapper around `toastFetchError` to create a function that can be used as a callback.
 */
export const createErrorToaster = (title?: string, toastOptions?: ExternalToast) => (err: Error) =>
  toastFetchError(err, { title, ...toastOptions })

export const toastFetchError = (
  error: Error,
  { title: _title, ..._toastOptions }: ExternalToast & { title?: string } = {},
) => {
  let message = ""
  let _reason = ""

  if (error instanceof FetchError) {
    try {
      const json = JSON.parse(error.response?._data)

      const { reason, code, message: _message } = json
      message = _message

      const tValue = t(`errors:${code}` as any)
      const i18nMessage = tValue === code.toString() ? message : tValue

      message = i18nMessage

      if (reason) {
        _reason = reason
      }
    } catch {
      message = error.message
    }
  }

  const toastOptions: ExternalToast = {
    ..._toastOptions,
    classNames: {
      toast: "items-start bg-theme-background",
      title: tw`-mt-0.5`, // to align with the icon (actually cut the top space from line-height)
      content: "w-full",
      ..._toastOptions.classNames,
    },
  }

  if (!_reason) {
    const title = _title || message
    toastOptions.description = _title ? message : undefined
    return toast.error(title, toastOptions)
  } else {
    return toast.error(message || _title, {
      duration: 5000,
      ...toastOptions,
      description: createElement("div", {}, [
        createElement(CopyButton, {
          className: cn(
            "relative z-[1] float-end -mt-1",
            "border-transparent bg-theme-background text-theme-foreground opacity-60 transition-opacity",
            "hover:bg-theme-button-hover hover:opacity-100 focus:border-theme-foreground/20",
          ),
          key: "copy",
          value: _reason,
        }),
        createElement(Markdown, {
          key: "reason",
          className: "text-sm opacity-70 min-w-0 flex-1 mt-1",
          children: _reason,
        }),
      ]),
    })
  }
}

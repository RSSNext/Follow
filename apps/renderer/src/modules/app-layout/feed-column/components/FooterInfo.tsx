import { useMobile } from "@follow/components/hooks/useMobile.js"
import { repository } from "@pkg"
import { useTranslation } from "react-i18next"

import { isWebBuild } from "~/constants"

export const FooterInfo = () => {
  const { t } = useTranslation()

  const isMobile = useMobile()
  return (
    <div className="relative !mt-0">
      {APP_VERSION?.[0] === "0" && (
        <div className="pointer-events-none w-full py-3 text-center text-xs opacity-20">
          {t("beta_access")} {GIT_COMMIT_SHA ? `(${GIT_COMMIT_SHA.slice(0, 7).toUpperCase()})` : ""}
        </div>
      )}

      {isWebBuild && !isMobile && (
        <div className="center absolute inset-y-0 right-2">
          <button
            type="button"
            aria-label="Download Desktop App"
            onClick={() => {
              window.open(`${repository.url}/releases`)
            }}
            className="center rounded-full border bg-background p-1.5 shadow-sm"
          >
            <i className="i-mgc-download-2-cute-re size-3.5 opacity-80" />
          </button>
        </div>
      )}
    </div>
  )
}

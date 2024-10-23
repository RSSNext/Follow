import * as React from "react"
import { useTranslation } from "react-i18next"

import { Button } from "~/components/ui/button"
import { LoadingCircle } from "~/components/ui/loading"
import { useCurrentModal } from "~/components/ui/modal"
import { createErrorToaster } from "~/lib/error-parser"

import { Tooltip, TooltipContent, TooltipTrigger } from "../../tooltip"

export interface UseAsyncFetcher<T> {
  data: Nullable<T>
  error: Nullable<Error>
  isLoading: boolean
  refetch: () => void
}
interface AsyncModalContentProps<T> {
  queryResult: UseAsyncFetcher<T>
  renderContent: (data: T) => React.ReactNode
  loadingComponent?: React.ReactNode
}

export function AsyncModalContent<T>({
  queryResult,
  renderContent,
  loadingComponent,
}: AsyncModalContentProps<T>) {
  const { data, isLoading, error, refetch } = queryResult
  const { dismiss } = useCurrentModal()

  React.useEffect(() => {
    if (error) {
      createErrorToaster()(error)
    }
  }, [error])
  const { t } = useTranslation("common")

  if (isLoading || !data) {
    return (
      loadingComponent || (
        <div className="center absolute inset-0 flex-col gap-4">
          <LoadingCircle size="large" />
          <div className="flex items-center gap-3">
            {!!error && (
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    onClick={() => refetch()}
                    variant="outline"
                    buttonClassName="p-2 rounded-full"
                  >
                    <i className="i-mgc-refresh-2-cute-re" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t("retry")}</TooltipContent>
              </Tooltip>
            )}
            <Tooltip>
              <TooltipTrigger>
                <Button onClick={dismiss} variant="outline" buttonClassName="p-2 rounded-full">
                  <i className="i-mgc-close-cute-re" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("close")}</TooltipContent>
            </Tooltip>
          </div>
        </div>
      )
    )
  }

  if (error) {
    return null // Error is already handled by the toaster
  }

  return renderContent(data)
}

import { useCallback, useEffect } from "react"
import { toast } from "sonner"
import { useRegisterSW } from "virtual:pwa-register/react"

// check for updates every hour
const period = 60 * 60 * 1000

export function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      if (period <= 0) return
      if (r?.active?.state === "activated") {
        registerPeriodicSync(period, swUrl, r)
      } else if (r?.installing) {
        r.installing.addEventListener("statechange", (e) => {
          const sw = e.target as ServiceWorker
          if (sw.state === "activated") registerPeriodicSync(period, swUrl, r)
        })
      }
    },
  })

  const close = useCallback(() => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }, [setNeedRefresh, setOfflineReady])

  useEffect(() => {
    if (offlineReady) {
      toast.info("App is ready to work offline", {
        action: {
          label: "Close",
          onClick: close,
        },
        duration: Infinity,
      })
    }
  }, [offlineReady, close])

  useEffect(() => {
    if (needRefresh) {
      toast.info("New version available", {
        action: {
          label: "Refresh",
          onClick: () => {
            updateServiceWorker(true)
          },
        },
        duration: Infinity,
      })
    }
  }, [needRefresh, updateServiceWorker])

  return null
}

/**
 * This function will register a periodic sync check every hour, you can modify the interval as needed.
 */
function registerPeriodicSync(period: number, swUrl: string, r: ServiceWorkerRegistration) {
  if (period <= 0) return

  setInterval(async () => {
    if ("onLine" in navigator && !navigator.onLine) return

    const resp = await fetch(swUrl, {
      cache: "no-store",
      headers: {
        cache: "no-store",
        "cache-control": "no-cache",
      },
    })

    if (resp?.status === 200) await r.update()
  }, period)
}

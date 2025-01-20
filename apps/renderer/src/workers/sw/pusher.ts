/// <reference lib="webworker" />
interface NewEntryMessage {
  description: string
  entryId: string
  feedId: string
  title: string
  type: "new-entry"
  view: string
}

type Message = NewEntryMessage

export const registerPusher = (self: ServiceWorkerGlobalScope) => {
  self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting()
  })

  // Firebase Cloud Messaging handler
  self.addEventListener("push", (event) => {
    if (event.data) {
      const { data } = event.data.json()
      const payload = data as Message

      switch (payload.type) {
        case "new-entry": {
          const notificationPromise = self.registration.showNotification(payload.title, {
            body: payload.description,
            icon: "https://app.follow.is/favicon.ico",
            data: {
              type: payload.type,
              feedId: payload.feedId,
              entryId: payload.entryId,
              view: Number.parseInt(payload.view),
            },
          })
          event.waitUntil(notificationPromise)
          break
        }
      }
    }
  })

  self.addEventListener("notificationclick", (event) => {
    event.notification.close()

    const notificationData = event.notification.data
    if (!notificationData) return

    let urlToOpen: URL

    switch (notificationData.type) {
      case "new-entry": {
        urlToOpen = new URL(
          `/feeds/${notificationData.feedId}/${notificationData.entryId}`,
          self.location.origin,
        )
        break
      }
      default: {
        urlToOpen = new URL("/", self.location.origin)
        break
      }
    }

    const promiseChain = self.clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((windowClients) => {
        if (windowClients.length > 0) {
          const client = windowClients[0]
          return client?.focus()
        }
        return self.clients.openWindow(urlToOpen.href)
      })
      .then((client) => {
        if (client && "postMessage" in client) {
          switch (notificationData.type) {
            case "new-entry": {
              client.postMessage({
                type: "NOTIFICATION_CLICK",
                action: "NAVIGATE_ENTRY",
                data: {
                  feedId: notificationData.feedId,
                  entryId: notificationData.entryId,
                  view: notificationData.view,
                  url: urlToOpen.pathname,
                },
              })
              break
            }
            default: {
              console.warn("Unknown notification type:", notificationData.type)
              break
            }
          }
        }
      })

    event.waitUntil(promiseChain)
  })
}

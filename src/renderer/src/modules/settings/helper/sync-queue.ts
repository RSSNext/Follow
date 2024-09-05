import {
  generalServerSyncWhiteListKeys,
  getGeneralSettings,
} from "@renderer/atoms/settings/general"
import {
  getUISettings,
  uiServerSyncWhiteListKeys,
} from "@renderer/atoms/settings/ui"
import { apiClient } from "@renderer/lib/api-fetch"
import { EventBus } from "@renderer/lib/event-bus"
import { getStorageNS } from "@renderer/lib/ns"
import type { GeneralSettings, UISettings } from "@shared/interface/settings"
import { omit } from "lodash-es"

type SettingMapping = {
  appearance: UISettings
  general: GeneralSettings
}

const omitKeys = ["updated"]

const localSettingGetterMap = {
  appearance: () => omit(getUISettings(), uiServerSyncWhiteListKeys, omitKeys),
  general: () =>
    omit(getGeneralSettings(), generalServerSyncWhiteListKeys, omitKeys),
}

const settingWhiteListMap = {
  appearance: uiServerSyncWhiteListKeys,
  general: generalServerSyncWhiteListKeys,
}

const bizSettingKeyToTabMapping = {
  ui: "appearance",
  general: "general",
}

export type SettingSyncTab = keyof SettingMapping
export interface SettingSyncQueueItem<
  T extends SettingSyncTab = SettingSyncTab,
> {
  tab: T
  payload: Partial<SettingMapping[T]>
  date: number
}
class SettingSyncQueue {
  queue: SettingSyncQueueItem[] = []

  private disposers: (() => void)[] = []
  async init() {
    this.teardown()

    this.load()
    this.flush()

    const d1 = EventBus.subscribe("SETTING_CHANGE_EVENT", (data) => {
      const tab = bizSettingKeyToTabMapping[data.key]
      if (!tab) return

      const nextPayload = omit(
        data.payload,
        omitKeys,
        settingWhiteListMap[tab],
      )
      if (Object.keys(nextPayload).length === 0) return
      this.enqueue(tab, nextPayload)
    })
    const onlineHandler = () => this.flush

    window.addEventListener("online", onlineHandler)
    const d2 = () => window.removeEventListener("online", onlineHandler)

    const unloadHandler = () => this.persist()

    window.addEventListener("beforeunload", unloadHandler)
    const d3 = () => window.removeEventListener("beforeunload", unloadHandler)

    this.disposers.push(d1, d2, d3)
  }

  teardown() {
    for (const disposer of this.disposers) {
      disposer()
    }
    this.queue = []
  }

  private readonly storageKey = getStorageNS("setting_sync_queue")
  private persist() {
    if (this.queue.length === 0) {
      return
    }
    localStorage.setItem(this.storageKey, JSON.stringify(this.queue))
  }

  private load() {
    const queue = localStorage.getItem(this.storageKey)
    if (!queue) {
      return
    }

    try {
      this.queue = JSON.parse(queue)
    } catch {
      /* empty */
    }
  }

  private threshold = 1000
  private enqueueTime = Date.now()

  async enqueue<T extends SettingSyncTab>(
    tab: T,
    payload: Partial<SettingMapping[T]>,
  ) {
    const now = Date.now()
    this.queue.push({
      tab,
      payload,
      date: now,
    })

    // TODO maybe need a lock
    if (now - this.enqueueTime > this.threshold) {
      await this.flush()
      this.enqueueTime = Date.now()
    }
  }

  private async flush() {
    if (navigator.onLine === false) {
      return
    }

    const groupedTab = {} as Record<SettingSyncTab, any>

    const referenceMap = {} as Record<
      SettingSyncTab,
      Set<SettingSyncQueueItem>
    >
    for (const item of this.queue) {
      if (!groupedTab[item.tab]) {
        groupedTab[item.tab] = {}
      }

      referenceMap[item.tab] ||= new Set()
      referenceMap[item.tab].add(item)

      groupedTab[item.tab] = {
        ...groupedTab[item.tab],
        ...item.payload,
      }
    }

    const promises = [] as Promise<any>[]
    for (const tab in groupedTab) {
      const promise = apiClient.settings[":tab"]
        .$patch({
          param: {
            tab,
          },
          json: groupedTab[tab],
        })
        .then(() => {
          // remove from queue
          for (const item of referenceMap[tab]) {
            const index = this.queue.indexOf(item)
            if (index !== -1) {
              this.queue.splice(index, 1)
            }
          }
        })
      // TODO rollback or retry
      promises.push(promise)
    }

    await Promise.all(promises)
  }

  replaceRemote(tab?: SettingSyncTab) {
    if (!tab) {
      const promises = [] as Promise<any>[]
      for (const tab in localSettingGetterMap) {
        const payload = localSettingGetterMap[tab]()
        const promise = apiClient.settings[":tab"].$patch({
          param: {
            tab,
          },
          json: payload,
        })

        promises.push(promise)
      }

      // Lock
      return Promise.all(promises)
    } else {
      const payload = localSettingGetterMap[tab]()

      return apiClient.settings[":tab"].$patch({
        param: {
          tab,
        },
        json: payload,
      })
    }
  }

  syncLocal() {}
}

export const settingSyncQueue = new SettingSyncQueue()

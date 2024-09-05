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
import { sleep } from "@renderer/lib/utils"
import type { GeneralSettings, UISettings } from "@shared/interface/settings"
import { omit } from "lodash-es"

type SettingMapping = {
  appearance: UISettings
  general: GeneralSettings
}

const localSettingGetterMap = {
  appearance: () => omit(getUISettings(), uiServerSyncWhiteListKeys),
  general: () => omit(getGeneralSettings(), generalServerSyncWhiteListKeys),
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

  async subscribe() {
    EventBus.subscribe("SETTING_CHANGE_EVENT", (data) => {
      const tab = bizSettingKeyToTabMapping[data.key]
      if (!tab) return

      this.enqueue(tab, data.payload)
    })
  }

  async enqueue<T extends SettingSyncTab>(
    tab: T,
    payload: Partial<SettingMapping[T]>,
  ) {
    this.queue.push({
      tab,
      payload,
      date: Date.now(),
    })

    // batch call
    await sleep(0).then(() => this.flush())
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
}

export const settingSyncQueue = new SettingSyncQueue()

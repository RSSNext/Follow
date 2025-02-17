import type { FeedViewType } from "@follow/constants"

import type { FeedSchema, InboxSchema } from "../database/schemas/types"
import type { CollectionModel } from "../store/collection/types"
import type { EntryModel } from "../store/entry/types"
import type { FeedModel } from "../store/feed/types"
import type { ListModel } from "../store/list/store"
import type { SubscriptionModel } from "../store/subscription/store"
import type { HonoApiClient } from "./types"

class Morph {
  toSubscription(data: HonoApiClient.Subscription_Get) {
    const subscriptions: SubscriptionModel[] = []

    // TODO list inbox
    const collections = {
      feeds: [],
      inboxes: [],
      lists: [],
    } as {
      feeds: FeedSchema[]
      inboxes: InboxSchema[]
      lists: ListModel[]
    }

    for (const item of data) {
      const baseSubscription = {
        category: item.category!,

        userId: item.userId,
        view: item.view,
        isPrivate: item.isPrivate,
        title: item.title,
        createdAt: item.createdAt,
      } as SubscriptionModel

      if ("feeds" in item) {
        baseSubscription.feedId = item.feedId
        baseSubscription.type = "feed"
        const feed = item.feeds
        collections.feeds.push({
          description: feed.description!,
          id: feed.id,
          errorAt: feed.errorAt!,
          errorMessage: feed.errorMessage!,
          image: feed.image!,
          ownerUserId: feed.ownerUserId!,
          siteUrl: feed.siteUrl!,
          title: feed.title!,
          url: feed.url,
        })
      }

      if ("inboxes" in item) {
        baseSubscription.inboxId = item.inboxId
        baseSubscription.type = "inbox"
        const inbox = item.inboxes

        collections.inboxes.push({
          id: inbox.id,
          title: inbox.title!,
        })
      }

      if ("lists" in item) {
        baseSubscription.listId = item.listId
        baseSubscription.type = "list"
        const list = item.lists
        if (list.owner)
          collections.lists.push({
            id: list.id,
            title: list.title!,
            userId: list.owner!.id,
            description: list.description!,
            view: list.view,
            image: list.image!,
            ownerUserId: list.owner.id,
            feedIds: list.feedIds!,
            fee: list.fee!,
            entryIds: [],
          })
      }

      subscriptions.push(baseSubscription)
    }
    return { subscriptions, ...collections }
  }

  toList(data: HonoApiClient.List_Get["list"] | HonoApiClient.List_List_Get): ListModel {
    return {
      id: data.id,
      title: data.title!,
      userId: data.ownerUserId!,
      description: data.description!,
      view: data.view,
      image: data.image!,
      ownerUserId: data.ownerUserId!,
      feedIds: data.feedIds!,
      fee: data.fee!,
      entryIds: [],
    }
  }

  toEntryList(data?: HonoApiClient.Entry_Post): EntryModel[] {
    const entries: EntryModel[] = []
    for (const item of data ?? []) {
      entries.push({
        id: item.entries.id,
        title: item.entries.title,
        url: item.entries.url,
        content: "",
        description: item.entries.description,
        guid: item.entries.guid,
        author: item.entries.author,
        authorUrl: item.entries.authorUrl,
        authorAvatar: item.entries.authorAvatar,
        insertedAt: new Date(item.entries.insertedAt),
        publishedAt: new Date(item.entries.publishedAt),
        media: item.entries.media ?? null,
        categories: item.entries.categories ?? null,
        attachments: item.entries.attachments ?? null,
        extra: item.entries.extra
          ? {
              links: item.entries.extra.links ?? undefined,
            }
          : null,
        language: item.entries.language,
        feedId: item.feeds.id,
        // TODO: handle inboxHandle
        inboxHandle: "",
        read: item.read,
      })
    }
    return entries
  }

  toCollections(data: HonoApiClient.Entry_Post, view: FeedViewType): CollectionModel[] {
    if (!data) return [] satisfies CollectionModel[]
    return data
      .map((item) => {
        if (!item.collections) {
          return null
        }
        return {
          createdAt: item.collections.createdAt,
          entryId: item.entries.id,
          feedId: item.feeds.id,
          view,
        } satisfies CollectionModel
      })
      .filter((i) => i !== null)
  }

  toEntry(data?: HonoApiClient.Entry_Get): EntryModel | null {
    if (!data) return null

    return {
      id: data.entries.id,
      title: data.entries.title,
      url: data.entries.url,
      content: data.entries.content,
      description: data.entries.description,
      guid: data.entries.guid,
      author: data.entries.author,
      authorUrl: data.entries.authorUrl,
      authorAvatar: data.entries.authorAvatar,
      insertedAt: new Date(data.entries.insertedAt),
      publishedAt: new Date(data.entries.publishedAt),
      media: data.entries.media ?? null,
      categories: data.entries.categories ?? null,
      attachments: data.entries.attachments ?? null,
      extra: data.entries.extra
        ? {
            links: data.entries.extra.links ?? undefined,
          }
        : null,
      language: data.entries.language,
      feedId: data.feeds.id,
      // TODO: handle inboxHandle
      inboxHandle: "",
      read: false,
    }
  }

  toFeed(data: HonoApiClient.Feed_Get["feed"]): FeedModel {
    return {
      id: data.id,
      title: data.title!,
      url: data.url,
      image: data.image!,
      description: data.description!,
      ownerUserId: data.ownerUserId!,
      errorAt: data.errorAt!,
      errorMessage: data.errorMessage!,
      siteUrl: data.siteUrl!,
    }
  }
}

export const honoMorph = new Morph()

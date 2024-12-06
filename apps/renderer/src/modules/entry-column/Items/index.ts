import { FeedViewType } from "@follow/constants"

import { ArticleItem, ArticleItemSkeleton } from "./article-item"
import { AudioItem, AudioItemSkeleton } from "./audio-item"
import { NotificationItem, NotificationItemSkeleton } from "./notification-item"
import { PictureItem, PictureItemSkeleton } from "./picture-item"
import { SocialMediaItem, SocialMediaItemSkeleton } from "./social-media-item"
import { VideoItem, VideoItemSkeleton } from "./video-item"

const ItemMap = {
  [FeedViewType.Articles]: ArticleItem,
  [FeedViewType.SocialMedia]: SocialMediaItem,
  [FeedViewType.Pictures]: PictureItem,
  [FeedViewType.Videos]: VideoItem,
  [FeedViewType.Audios]: AudioItem,
  [FeedViewType.Notifications]: NotificationItem,
}
export const getItemComponentByView = (view: FeedViewType) => {
  return ItemMap[view] || ArticleItem
}

const SkeletonItemMap = {
  [FeedViewType.Articles]: ArticleItemSkeleton,
  [FeedViewType.SocialMedia]: SocialMediaItemSkeleton,
  [FeedViewType.Pictures]: PictureItemSkeleton,
  [FeedViewType.Videos]: VideoItemSkeleton,
  [FeedViewType.Audios]: AudioItemSkeleton,
  [FeedViewType.Notifications]: NotificationItemSkeleton,
}

export const getSkeletonItemComponentByView = (view: FeedViewType) => {
  return SkeletonItemMap[view]
}

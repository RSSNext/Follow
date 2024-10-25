import { FeedViewType } from "@follow/constants"

import { ArticleItem, ArticleItemSkeleton, ArticleItemStateLess } from "./article-item"
import { AudioItem, AudioItemSkeleton, AudioItemStateLess } from "./audio-item"
import {
  NotificationItem,
  NotificationItemSkeleton,
  NotificationItemStateLess,
} from "./notification-item"
import { PictureItem, PictureItemSkeleton, PictureItemStateLess } from "./picture-item"
import {
  SocialMediaItem,
  SocialMediaItemSkeleton,
  SocialMediaItemStateLess,
} from "./social-media-item"
import { VideoItem, VideoItemSkeleton, VideoItemStateLess } from "./video-item"

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

const StatelessItemMap = {
  [FeedViewType.Articles]: ArticleItemStateLess,
  [FeedViewType.SocialMedia]: SocialMediaItemStateLess,
  [FeedViewType.Pictures]: PictureItemStateLess,
  [FeedViewType.Videos]: VideoItemStateLess,
  [FeedViewType.Audios]: AudioItemStateLess,
  [FeedViewType.Notifications]: NotificationItemStateLess,
}

export const getStatelessItemComponentByView = (view: FeedViewType) => {
  return StatelessItemMap[view] || ArticleItemStateLess
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

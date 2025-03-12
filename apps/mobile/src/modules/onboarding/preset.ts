import { FeedViewType } from "@follow/constants"

export type PresetFeedConfig = {
  title: string
  feedId: string
  url: string
  view: FeedViewType
}

export const presetFeeds: PresetFeedConfig[] = [
  {
    feedId: "41358761177015296",
    title: "知乎热榜 - 全站",
    url: "rsshub://zhihu/hot/total",
    view: FeedViewType.Articles,
  },
  {
    feedId: "100020530265058357",
    title: "阮一峰的网络日志",
    url: "https://feeds.feedburner.com/ruanyifeng",
    view: FeedViewType.Articles,
  },

  {
    feedId: "41358830592746496",
    title: "微博热搜榜",
    url: "rsshub://weibo/search/hot",
    view: FeedViewType.SocialMedia,
  },
  {
    feedId: "100411504863520768",
    title: "Twitter @Elon Musk",
    url: "rsshub://twitter/user/elonmusk",
    view: FeedViewType.SocialMedia,
  },
  {
    feedId: "41324816676184077",
    title: "Twitter @DIŸgöd ☀️",
    url: "rsshub://twitter/user/DIYgod",
    view: FeedViewType.SocialMedia,
  },

  {
    feedId: "78806242632741888",
    title: "bilibili 排行榜-全站",
    url: "rsshub://bilibili/ranking/0",
    view: FeedViewType.Videos,
  },

  {
    feedId: "60338304723722240",
    title: "实时财经快讯 - FastBull",
    url: "rsshub://fastbull/express-news",
    view: FeedViewType.Articles,
  },
  {
    feedId: "55611390687386624",
    title: "格隆汇快讯-7x24小时市场快讯-财经市场热点",
    url: "rsshub://gelonghui/live",
    view: FeedViewType.Articles,
  },
  {
    feedId: "49375919416104960",
    title: "深潮TechFlow - 快讯",
    url: "rsshub://techflowpost/express",
    view: FeedViewType.Articles,
  },
  {
    feedId: "55982073122828305",
    title: "TED Talks Daily",
    url: "https://feeds.acast.com/public/shows/67587e77c705e441797aff96",
    view: FeedViewType.Articles,
  },
  {
    feedId: "72541715399995392",
    title: "TheBlockBeats - 快讯",
    url: "rsshub://theblockbeats/newsflash/0",
    view: FeedViewType.Articles,
  },
  {
    feedId: "100184911354754055",
    title: "小Lin说",
    url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCilwQlk62k1z7aUEZPOB6yw",
    view: FeedViewType.Videos,
  },
  {
    feedId: "100185810923910148",
    title: "张小珺Jùn｜商业访谈录",
    url: "https://feed.xyzfm.space/dk4yh3pkpjp3",
    view: FeedViewType.Articles,
  },
  {
    feedId: "56584656988676096",
    title: "迷因电波",
    url: "rsshub://xiaoyuzhou/podcast/61d52b3bee197a3aac3dac44",
    view: FeedViewType.Articles,
  },
  {
    feedId: "76051724651752448",
    title: "极致音乐汇 的 bilibili 空间",
    url: "rsshub://bilibili/user/video/1691501735",
    view: FeedViewType.Videos,
  },
  {
    feedId: "66701376672681984",
    title: "AP Top News - AP News",
    url: "rsshub://apnews/api/apf-topnews",
    view: FeedViewType.Articles,
  },
  {
    feedId: "44366244616936448",
    title: "金十数据",
    url: "rsshub://jin10",
    view: FeedViewType.Articles,
  },
  {
    feedId: "52325519371718656",
    title: "Hacker News",
    url: "rsshub://hackernews",
    view: FeedViewType.Articles,
  },
]

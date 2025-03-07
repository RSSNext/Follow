import * as Linking from "expo-linking"

import { openLink } from "@/src/lib/native"

export const transformVideoUrl = ({
  url,
  mini = false,
  isIframe = false,
  attachments,
}: {
  url: string
  mini?: boolean
  isIframe?: boolean
  attachments?:
    | {
        url: string
        mime_type?: string
      }[]
    | null
}): string | null => {
  if (url?.match(/\/\/www.bilibili.com\/video\/BV\w+/)) {
    const player = isIframe
      ? "https://player.bilibili.com/player.html"
      : "https://www.bilibili.com/blackboard/newplayer.html"
    return `${player}?${new URLSearchParams({
      isOutside: "true",
      autoplay: "true",
      danmaku: "true",
      muted: mini ? "true" : "false",
      highQuality: "true",
      bvid: url.match(/\/\/www.bilibili.com\/video\/(BV\w+)/)?.[1] || "",
    }).toString()}`
  }

  if (url?.match(/\/\/www.youtube.com\/watch\?v=[-\w]+/)) {
    return `https://www.youtube-nocookie.com/embed/${url.match(/\/\/www.youtube.com\/watch\?v=([-\w]+)/)?.[1]}?${new URLSearchParams(
      {
        controls: mini ? "0" : "1",
        autoplay: "1",
        mute: mini ? "1" : "0",
      },
    ).toString()}`
  }

  if (attachments) {
    return attachments.find((attachment) => attachment.mime_type === "text/html")?.url ?? null
  }
  return null
}

const parseSchemeLink = (url: string) => {
  if (!URL.canParse(url)) return null
  const urlObject = new URL(url)
  switch (urlObject.hostname) {
    case "www.bilibili.com": {
      // bilibili://video/{av}or{bv}
      const bvid = urlObject.pathname.match(/video\/(BV\w+)/)?.[1]
      return bvid ? `bilibili://video/${bvid}` : null
    }
    case "www.youtube.com": {
      // youtube://watch?v=xxx
      const videoId = urlObject.searchParams.get("v")
      return videoId ? `youtube://watch?v=${videoId}` : null
    }
    default: {
      return null
    }
  }
}

export const openVideo = async (url: string, openVideoInApp = false) => {
  if (openVideoInApp) {
    const schemeLink = parseSchemeLink(url)
    const isInstalled = schemeLink && (await Linking.canOpenURL(schemeLink))
    if (schemeLink && isInstalled) {
      await Linking.openURL(schemeLink)
      return
    }
  }

  // Fallback to opening in in-app browser
  const formattedUrl = transformVideoUrl({ url }) || url
  openLink(formattedUrl)
}

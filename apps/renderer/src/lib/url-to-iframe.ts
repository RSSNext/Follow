import { IN_ELECTRON } from "@follow/shared/constants"

export const urlToIframe = (url?: string | null, mini?: boolean) => {
  if (url?.match(/\/\/www.bilibili.com\/video\/BV\w+/)) {
    const player = IN_ELECTRON
      ? "https://www.bilibili.com/blackboard/newplayer.html"
      : "https://player.bilibili.com/player.html"
    return `${player}?${new URLSearchParams({
      isOutside: "true",
      autoplay: "true",
      danmaku: "true",
      muted: mini ? "true" : "false",
      highQuality: "true",
      bvid: url.match(/\/\/www.bilibili.com\/video\/(BV\w+)/)?.[1] || "",
    }).toString()}`
  } else if (url?.match(/\/\/www.youtube.com\/watch\?v=[-\w]+/)) {
    return `https://www.youtube-nocookie.com/embed/${url.match(/\/\/www.youtube.com\/watch\?v=([-\w]+)/)?.[1]}?${new URLSearchParams(
      {
        controls: mini ? "0" : "1",
        autoplay: "1",
        mute: mini ? "1" : "0",
      },
    ).toString()}`
  } else {
    return null
  }
}

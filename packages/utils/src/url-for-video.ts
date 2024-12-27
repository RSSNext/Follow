export const transformVideoUrl = ({
  url,
  mini = false,
  isIframe = false,
}: {
  url: string
  mini?: boolean
  isIframe?: boolean
}) => {
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
  return null
}

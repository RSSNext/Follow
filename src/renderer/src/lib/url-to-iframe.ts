export const urlToIframe = (url?: string | null) => {
  if (url?.match(/\/\/www.bilibili.com\/video\/BV\w+/)) {
    return `https://player.bilibili.com/player.html?${new URLSearchParams({
      isOutside: "true",
      autoplay: "true",
      danmaku: "true",
      muted: "true",
      highQuality: "true",
      bvid: url.match(/\/\/www.bilibili.com\/video\/(BV\w+)/)?.[1] || "",
    }).toString()}`
  } else if (url?.match(/\/\/www.youtube.com\/watch\?v=[-\w]+/)) {
    return `https://www.youtube-nocookie.com/embed/${url.match(/\/\/www.youtube.com\/watch\?v=([-\w]+)/)?.[1]}?${new URLSearchParams({
      controls: "0",
      autoplay: "1",
      mute: "1",
    }).toString()}`
  } else {
    return null
  }
}

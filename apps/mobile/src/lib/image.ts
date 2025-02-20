export const getImageHeaders = (url: string | undefined) => {
  if (!url) return {}

  if (url.startsWith("https://cdnfile.sspai.com")) {
    return {
      Referer: "https://sspai.com",
    }
  }

  return {}
}

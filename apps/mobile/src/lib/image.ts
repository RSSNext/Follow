export const getImageHeaders = (url: string) => {
  if (url.startsWith("https://cdnfile.sspai.com")) {
    return {
      Referer: "https://sspai.com",
    }
  }

  return {}
}

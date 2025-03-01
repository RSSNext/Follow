const profile = "prod"

const appEndpointMap = {
  prod: {
    api: "https://api.follow.is",
    web: "https://app.follow.is",
  },
  dev: {
    api: "https://api.dev.follow.is",
    web: "https://dev.follow.is",
  },
  staging: {
    api: "https://api.follow.is",
    web: "https://staging.follow.is",
  },
}

export const env = {
  VITE_WEB_URL: appEndpointMap[profile].web,
  VITE_API_URL: appEndpointMap[profile].api,
}

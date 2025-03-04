const profile = "prod"

const appEndpointMap = {
  prod: {
    VITE_API_URL: "https://api.follow.is",
    VITE_WEB_URL: "https://app.follow.is",
    VITE_INBOXES_EMAIL: "@follow.re",
  },
  dev: {
    VITE_API_URL: "https://api.dev.follow.is",
    VITE_WEB_URL: "https://dev.follow.is",
    VITE_INBOXES_EMAIL: "__devdev@follow.re",
  },
  staging: {
    VITE_API_URL: "https://api.follow.is",
    VITE_WEB_URL: "https://staging.follow.is",
    VITE_INBOXES_EMAIL: "@follow.re",
  },
}

export const env = {
  VITE_WEB_URL: appEndpointMap[profile].VITE_WEB_URL,
  VITE_API_URL: appEndpointMap[profile].VITE_API_URL,
}

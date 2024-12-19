import { OpenPanel } from "@openpanel/web"

export const op = new OpenPanel({
  clientId: process.env.EXPO_PUBLIC_OPENPANEL_CLIENT_ID ?? "",
  trackScreenViews: true,
  trackOutgoingLinks: true,
  trackAttributes: true,
  apiUrl: process.env.EXPO_PUBLIC_OPENPANEL_API_URL,
})

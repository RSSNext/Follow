import CookieManager from "@react-native-cookies/cookies"
import { useQuery } from "@tanstack/react-query"

export function useAuthCookie() {
  return useQuery({
    queryKey: ["auth-cookie"],
    queryFn: async () => {
      const cookies = await CookieManager.get(process.env.EXPO_PUBLIC_API_URL)
      return cookies["better-auth.session_token"] ?? null
    },
  })
}

import * as AppleAuthentication from "expo-apple-authentication"
import { useColorScheme } from "nativewind"
import { useContext } from "react"
import { Platform, TouchableOpacity, View } from "react-native"

import { LoginTeamsCheckGuardContext } from "@/src/contexts/LoginTeamsContext"
import { AppleCuteFiIcon } from "@/src/icons/apple_cute_fi"
import { GithubCuteFiIcon } from "@/src/icons/github_cute_fi"
import { GoogleCuteFiIcon } from "@/src/icons/google_cute_fi"
import { signIn, useAuthProviders } from "@/src/lib/auth"

const provider: Record<
  string,
  {
    id: string
    color: string
    darkColor: string
    icon: (props: { width?: number; height?: number; color?: string }) => React.ReactNode
  }
> = {
  google: {
    id: "google",
    color: "#3b82f6",
    darkColor: "#2563eb",
    icon: GoogleCuteFiIcon,
  },
  github: {
    id: "github",
    color: "#000000",
    darkColor: "#ffffff",
    icon: GithubCuteFiIcon,
  },
  apple: {
    id: "apple",
    color: "#1f2937",
    darkColor: "#ffffff",
    icon: AppleCuteFiIcon,
  },
}

export function SocialLogin() {
  const { data } = useAuthProviders()
  const teamsCheckGuard = useContext(LoginTeamsCheckGuardContext)
  const { colorScheme } = useColorScheme()

  return (
    <View className="flex flex-row justify-center gap-4">
      {Object.keys(provider)
        .filter((key) => key !== "apple" || (Platform.OS === "ios" && key === "apple"))
        .map((key) => {
          const providerInfo = provider[key]!
          return (
            <TouchableOpacity
              key={key}
              className="border-opaque-separator border-hairline rounded-full p-2"
              onPress={() =>
                teamsCheckGuard?.(async () => {
                  if (!data?.[providerInfo.id]) return

                  if (providerInfo.id === "apple") {
                    try {
                      const credential = await AppleAuthentication.signInAsync({
                        requestedScopes: [
                          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                          AppleAuthentication.AppleAuthenticationScope.EMAIL,
                        ],
                      })

                      if (credential.identityToken) {
                        await signIn.social({
                          provider: "apple",
                          idToken: {
                            token: credential.identityToken,
                          },
                        })
                      } else {
                        throw new Error("No identityToken.")
                      }
                    } catch (e) {
                      console.error(e)
                      // handle errors
                    }
                    return
                  }

                  signIn.social({
                    provider: providerInfo.id as any,
                    callbackURL: "/",
                  })
                })
              }
              disabled={!data?.[providerInfo.id]}
            >
              <providerInfo.icon
                width={20}
                height={20}
                color={colorScheme === "dark" ? providerInfo.darkColor : providerInfo.color}
              />
            </TouchableOpacity>
          )
        })}
    </View>
  )
}

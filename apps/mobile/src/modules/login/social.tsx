import { TouchableOpacity, View } from "react-native"

import { AppleCuteFiIcon } from "@/src/icons/apple_cute_fi"
import { GithubCuteFiIcon } from "@/src/icons/github_cute_fi"
import { GoogleCuteFiIcon } from "@/src/icons/google_cute_fi"
import { signIn, useAuthProviders } from "@/src/lib/auth"

const provider: Record<
  string,
  {
    id: string
    color: string
    icon: (props: { width?: number; height?: number; color?: string }) => React.ReactNode
  }
> = {
  google: {
    id: "google",
    color: "#3b82f6",
    icon: GoogleCuteFiIcon,
  },
  github: {
    id: "github",
    color: "#000000",
    icon: GithubCuteFiIcon,
  },
  apple: {
    id: "apple",
    color: "#1f2937",
    icon: AppleCuteFiIcon,
  },
}

export function SocialLogin() {
  const { data } = useAuthProviders()

  if (!data) {
    return null
  }

  return (
    <View className="flex flex-row gap-4">
      {Object.keys(data)
        .filter((key) => provider[key])
        .map((key) => {
          const providerInfo = provider[key]
          return (
            <TouchableOpacity
              key={key}
              onPress={() => {
                signIn.social({
                  provider: providerInfo.id as any,
                  callbackURL: "/",
                })
              }}
            >
              <providerInfo.icon width={32} height={32} color={providerInfo.color} />
            </TouchableOpacity>
          )
        })}
    </View>
  )
}

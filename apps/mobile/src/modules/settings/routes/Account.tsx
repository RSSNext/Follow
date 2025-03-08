import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import * as FileSystem from "expo-file-system"
import type { FC } from "react"
import { useMemo } from "react"
import { Alert, Text, View } from "react-native"

import {
  NavigationBlurEffectHeader,
  SafeNavigationScrollView,
} from "@/src/components/layouts/views/SafeNavigationScrollView"
import {
  GroupedInsetListCard,
  GroupedInsetListNavigationLink,
  GroupedInsetListNavigationLinkIcon,
  GroupedInsetListSectionHeader,
  GroupedPlainButtonCell,
} from "@/src/components/ui/grouped/GroupedList"
import { getDbPath } from "@/src/database"
import { AppleCuteFiIcon } from "@/src/icons/apple_cute_fi"
import { GithubCuteFiIcon } from "@/src/icons/github_cute_fi"
import { GoogleCuteFiIcon } from "@/src/icons/google_cute_fi"
import type { AuthProvider } from "@/src/lib/auth"
import { getAccountInfo, getProviders, linkSocial, signOut, unlinkAccount } from "@/src/lib/auth"
import { openLink } from "@/src/lib/native"
import { toast } from "@/src/lib/toast"

type Account = {
  id: string
  provider: string
  profile: {
    id?: string
    email?: string
    name?: string
    image?: string
  } | null
}

const accountInfoKey = ["account-info"]
export const AccountScreen = () => {
  const { data: accounts } = useQuery({
    queryKey: accountInfoKey,
    queryFn: () => getAccountInfo(),
  })

  const { data: providers } = useQuery({
    queryKey: ["providers"],
    queryFn: async () => (await getProviders()).data as Record<string, AuthProvider>,
  })

  const providerToAccountMap = useMemo(() => {
    return Object.keys(providers || {}).reduce(
      (acc, provider) => {
        acc[provider] = accounts?.data?.find((account) => account.provider === provider)!
        return acc
      },
      {} as Record<string, Account>,
    )
  }, [accounts?.data, providers])

  return (
    <SafeNavigationScrollView className="bg-system-grouped-background">
      <NavigationBlurEffectHeader title="Account" />
      {providers && (
        <View className="mt-6">
          <GroupedInsetListSectionHeader label="Authentication" />
          <GroupedInsetListCard>
            {Object.keys(providers).map((provider) => (
              <AccountLinker
                key={provider}
                provider={provider as any}
                account={providerToAccountMap[provider]}
              />
            ))}
          </GroupedInsetListCard>
        </View>
      )}

      {/* Danger Zone */}
      <View className="mt-6">
        <GroupedInsetListSectionHeader label="Danger Zone" />
        <GroupedInsetListCard>
          <GroupedPlainButtonCell
            label="Delete account"
            textClassName="text-red text-left"
            onPress={async () => {
              Alert.alert("Delete account", "Are you sure you want to delete your account?", [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: async () => {
                    await signOut()
                    const dbPath = getDbPath()
                    await FileSystem.deleteAsync(dbPath)
                    await expo.reloadAppAsync("User sign out")
                  },
                },
              ])
            }}
          />
        </GroupedInsetListCard>
      </View>
    </SafeNavigationScrollView>
  )
}

const provider2IconMap = {
  google: (
    <GroupedInsetListNavigationLinkIcon backgroundColor="#4081EC">
      <GoogleCuteFiIcon height={24} width={24} color="#fff" />
    </GroupedInsetListNavigationLinkIcon>
  ),
  github: (
    <GroupedInsetListNavigationLinkIcon backgroundColor="#000">
      <GithubCuteFiIcon height={24} width={24} color="#fff" />
    </GroupedInsetListNavigationLinkIcon>
  ),
  apple: (
    <GroupedInsetListNavigationLinkIcon backgroundColor="#000">
      <AppleCuteFiIcon height={24} width={24} color="#fff" />
    </GroupedInsetListNavigationLinkIcon>
  ),
}

const provider2LabelMap = {
  google: "Google",
  github: "GitHub",
  apple: "Apple",
}
const AccountLinker: FC<{
  provider: keyof typeof provider2IconMap
  account?: Account
}> = ({ provider, account }) => {
  const queryClient = useQueryClient()
  const unlinkAccountMutation = useMutation({
    mutationFn: async () => {
      const res = await unlinkAccount({ providerId: provider })
      if (res.error) throw new Error(res.error.message)
    },
    onSuccess: () => {
      toast.success("Unlinked account success")
      queryClient.invalidateQueries({ queryKey: accountInfoKey })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  if (!provider2LabelMap[provider]) return null
  return (
    <GroupedInsetListNavigationLink
      label={provider2LabelMap[provider]}
      icon={provider2IconMap[provider]}
      postfix={
        <Text className="text-secondary-label mr-1 max-w-[100px]">
          {account?.profile?.email || account?.profile?.name || ""}
        </Text>
      }
      onPress={() => {
        if (!account) {
          linkSocial({
            provider: provider as any,
          }).then((res) => {
            if (res.data) {
              openLink(res.data.url)
            }
          })
          return
        }

        Alert.alert("Unlink account", "Are you sure you want to unlink your account?", [
          { text: "Cancel", style: "cancel" },
          {
            text: "Unlink",
            style: "destructive",
            onPress: () => unlinkAccountMutation.mutate(),
          },
        ])
      }}
    />
  )
}

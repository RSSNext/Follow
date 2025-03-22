import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import * as FileSystem from "expo-file-system"
import type { FC } from "react"
import { useMemo } from "react"
import { ActivityIndicator, Alert, Text, View } from "react-native"

import {
  NavigationBlurEffectHeader,
  SafeNavigationScrollView,
} from "@/src/components/layouts/views/SafeNavigationScrollView"
import { GroupedInsetListCardItemStyle } from "@/src/components/ui/grouped/GroupedInsetListCardItemStyle"
import {
  GroupedInsetListCard,
  GroupedInsetListNavigationLink,
  GroupedInsetListNavigationLinkIcon,
  GroupedInsetListSectionHeader,
  GroupedOutlineDescription,
  GroupedPlainButtonCell,
} from "@/src/components/ui/grouped/GroupedList"
import { getDbPath } from "@/src/database"
import { AppleCuteFiIcon } from "@/src/icons/apple_cute_fi"
import { GithubCuteFiIcon } from "@/src/icons/github_cute_fi"
import { GoogleCuteFiIcon } from "@/src/icons/google_cute_fi"
import type { AuthProvider } from "@/src/lib/auth"
import {
  forgetPassword,
  getAccountInfo,
  getProviders,
  linkSocial,
  signOut,
  unlinkAccount,
} from "@/src/lib/auth"
import { Dialog } from "@/src/lib/dialog"
import { loading } from "@/src/lib/loading"
import { openLink } from "@/src/lib/native"
import { useNavigation } from "@/src/lib/navigation/hooks"
import { toast } from "@/src/lib/toast"
import { useWhoami } from "@/src/store/user/hooks"
import { userSyncService } from "@/src/store/user/store"

import { ConfirmPasswordDialog } from "../../dialogs/ConfirmPasswordDialog"
import { TwoFASetting } from "./2FASetting"
import { ResetPassword } from "./ResetPassword"

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
const userProviderKey = ["providers"]

const useAccount = () => {
  return useQuery({
    queryKey: accountInfoKey,
    queryFn: () => getAccountInfo(),
  })
}
export const AccountScreen = () => {
  return (
    <SafeNavigationScrollView className="bg-system-grouped-background">
      <NavigationBlurEffectHeader title="Account" />

      <AuthenticationSection />

      <SecuritySection />

      {/* Danger Zone */}

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
      if (!account) throw new Error("Account not found")
      const res = await unlinkAccount({ providerId: provider, accountId: account.id })
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
        <Text ellipsizeMode="tail" className="text-secondary-label mr-1 max-w-[100px]">
          {account?.profile?.email || account?.profile?.name || ""}
        </Text>
      }
      onPress={() => {
        if (!account) {
          linkSocial({
            provider: provider as any,
          }).then((res) => {
            if (res.data) {
              openLink(res.data.url, () => {
                queryClient.invalidateQueries({
                  queryKey: [accountInfoKey],
                })
                queryClient.invalidateQueries({
                  queryKey: [userProviderKey],
                })
              })
            } else {
              toast.error("Failed to link account")
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
;(AccountLinker as any).itemStyle = GroupedInsetListCardItemStyle.NavigationLink

const AuthenticationSection = () => {
  const { data: accounts } = useAccount()

  const { data: providers, isLoading } = useQuery({
    queryKey: userProviderKey,
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
    <>
      <GroupedInsetListSectionHeader label="Authentication" />
      <GroupedInsetListCard>
        {providers ? (
          Object.keys(providers).map((provider) => (
            <AccountLinker
              key={provider}
              provider={provider as any}
              account={providerToAccountMap[provider]}
            />
          ))
        ) : isLoading ? (
          <View className="flex h-12 flex-1 items-center justify-center">
            <ActivityIndicator />
          </View>
        ) : null}
      </GroupedInsetListCard>
      <GroupedOutlineDescription description="You can currently only connect social accounts with the same email." />
    </>
  )
}

const SecuritySection = () => {
  const { data: account } = useAccount()
  const hasPassword = account?.data?.find((account) => account.provider === "credential")
  const whoAmI = useWhoami()

  const twoFactorEnabled = whoAmI?.twoFactorEnabled

  const navigation = useNavigation()
  return (
    <>
      <GroupedInsetListSectionHeader label="Security" />
      <GroupedInsetListCard>
        <GroupedPlainButtonCell
          textClassName="text-left"
          label="Change password"
          onPress={() => {
            const email = whoAmI?.email || ""
            if (!email) {
              toast.error("You need to login with email first")
              return
            }
            if (!hasPassword) {
              forgetPassword({ email })
              toast.success("We have sent you an email with instructions to reset your password.")
            } else {
              navigation.pushControllerView(ResetPassword)
            }
          }}
        />
        <GroupedPlainButtonCell
          textClassName="text-left"
          label={twoFactorEnabled ? "Disable 2FA" : "Setting 2FA"}
          onPress={() => {
            Dialog.show(ConfirmPasswordDialog, {
              override: {
                async onConfirm(ctx) {
                  ctx.dismiss()

                  const { done } = loading.start()

                  if (twoFactorEnabled) {
                    const res = await userSyncService
                      .updateTwoFactor(false, ctx.password)
                      .finally(() => done())

                    if (res.error?.message) {
                      toast.error("Invalid password or something went wrong")
                      return
                    }
                    toast.success("2FA disabled")
                    return
                  }
                  const { password } = ctx

                  const res = await userSyncService
                    .updateTwoFactor(true, password)
                    .finally(() => done())

                  if (res.error?.message) {
                    toast.error("Invalid password or something went wrong")
                    return
                  }
                  if (res.data && "totpURI" in res.data) {
                    navigation.pushControllerView(TwoFASetting, {
                      totpURI: res.data.totpURI,
                    })
                  } else {
                    toast.error("Failed to enable 2FA")
                  }
                },
              },
            })
          }}
        />
      </GroupedInsetListCard>
    </>
  )
}

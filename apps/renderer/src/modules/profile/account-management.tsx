import { Button } from "@follow/components/ui/button/index.js"
import { authProvidersConfig } from "@follow/constants"
import { linkSocial } from "@follow/shared/auth"
import { IN_ELECTRON } from "@follow/shared/constants"
import { cn } from "@follow/utils/utils"
import { useTranslation } from "react-i18next"

import { useSocialAccounts } from "~/queries/auth"
import { useAuthProviders } from "~/queries/users"

export function AccountManagement() {
  const { t } = useTranslation("settings")
  const { data: accounts } = useSocialAccounts()
  const { data: providers } = useAuthProviders()

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold">Auth Providers</p>
      <div className="space-x-2">
        {Object.keys(providers || {})
          .filter((provider) => provider !== "credential")
          .map((provider) => {
            const account = accounts?.find((account) => account.provider === provider)
            if (!account && IN_ELECTRON) return null
            return (
              <Button
                key={provider}
                variant={account ? "outline" : "primary"}
                className="gap-2"
                onClick={() => {
                  if (!account) {
                    linkSocial({
                      provider: provider as any,
                    })
                    return
                  }
                  // TODO: Implement delete social account after https://github.com/better-auth/better-auth/pull/1059
                }}
              >
                <i className={cn("text-xl", authProvidersConfig[provider]?.iconClassName)} />
                <span>{account ? account.profile?.email || account.profile?.name : "Link"}</span>
              </Button>
            )
          })}
      </div>
      <p className="text-xs text-muted-foreground">{t("profile.link_social.description")}</p>
    </div>
  )
}

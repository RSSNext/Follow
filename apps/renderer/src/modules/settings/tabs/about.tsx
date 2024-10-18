import { license, repository } from "@pkg"
import { Trans, useTranslation } from "react-i18next"

import { Logo } from "~/components/icons/logo"
import { Button } from "~/components/ui/button"
import { styledButtonVariant } from "~/components/ui/button/variants"
import { CopyButton } from "~/components/ui/code-highlighter"
import { Divider } from "~/components/ui/divider"
import { SocialMediaLinks } from "~/constants/social"
import { getCurrentEnvironment } from "~/lib/environment"
import { getNewIssueUrl } from "~/lib/issues"

export const SettingAbout = () => {
  const { t } = useTranslation("settings")
  const currentEnvironment = getCurrentEnvironment().join("\n")

  return (
    <div>
      <section className="mt-4">
        <div className="flex gap-3">
          <Logo className="size-[52px]" />

          <div className="flex grow flex-col">
            <div className="text-lg font-bold">
              {APP_NAME} {!import.meta.env.PROD ? `(${import.meta.env.MODE})` : ""}
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-muted px-2 py-1 text-xs">{APP_VERSION}</span>
              <CopyButton
                value={currentEnvironment}
                className="border-0 bg-transparent p-1 text-foreground/80 hover:bg-theme-item-hover hover:text-foreground active:bg-theme-item-active [&_i]:size-3"
              />
            </div>
          </div>

          <div className="shrink-0">
            <Button
              variant="outline"
              onClick={() => {
                window.open(`${repository.url}/releases`, "_blank")
              }}
            >
              {t("about.changelog")}
            </Button>
          </div>
        </div>

        <p className="mt-6 text-balance text-sm">
          {t("about.licenseInfo", { appName: APP_NAME, license })}
        </p>
        <p className="mt-3 text-balance text-sm">
          <Trans
            ns="settings"
            i18nKey="about.iconLibrary"
            components={{
              IconLibraryLink: (
                <a
                  className="follow-link--underline inline-flex items-center"
                  href="https://mgc.mingcute.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  https://mgc.mingcute.com/
                </a>
              ),
              ExternalLinkIcon: <i className="i-mgc-external-link-cute-re translate-y-px" />,
            }}
          />
        </p>

        <p className="mt-3 text-sm">
          <Trans
            ns="settings"
            i18nKey="about.feedbackInfo"
            values={{ appName: APP_NAME, commitSha: GIT_COMMIT_SHA.slice(0, 7).toUpperCase() }}
            components={{
              OpenIssueLink: (
                <a
                  className="inline-flex cursor-pointer items-center gap-1 hover:underline"
                  href={getNewIssueUrl()}
                  target="_blank"
                >
                  open an issue
                  <i className="i-mgc-external-link-cute-re" />
                </a>
              ),
              ExternalLinkIcon: <i className="i-mgc-external-link-cute-re" />,
            }}
          />
        </p>

        <Divider className="scale-x-50" />

        <h2 className="text-base font-semibold">{t("about.socialMedia")}</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {SocialMediaLinks.map((link) => (
            <a
              href={link.url}
              key={link.url}
              className={styledButtonVariant({
                variant: "outline",
                className: "flex-1 gap-1",
              })}
              target="_blank"
              rel="noreferrer"
            >
              <i className={link.icon} />
              {link.label}
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}

import { license, repository } from "@pkg"
import { Logo } from "@renderer/components/icons/logo"
import { Button, StyledButton } from "@renderer/components/ui/button"
import { Divider } from "@renderer/components/ui/divider"
import { SocialMediaLinks } from "@renderer/constants/social"
import { getNewIssueUrl } from "@renderer/lib/issues"

import { SettingsTitle } from "../title"

export const SettingAbout = () => (
  <div>
    <SettingsTitle />
    <section className="mt-4">
      <div className="flex gap-3">
        <Logo className="size-[52px]" />

        <div className="flex grow flex-col">
          <div className="text-lg font-bold">
            {APP_NAME}
            {" "}
            {!import.meta.env.PROD ? `(${import.meta.env.MODE})` : ""}
          </div>
          <div>
            <span className="rounded bg-muted px-2 py-1 text-xs">
              {APP_VERSION}
            </span>
          </div>
        </div>

        <div className="shrink-0">
          <StyledButton
            variant="outline"
            onClick={() => {
              window.open(`${repository.url}/releases`, "_blank")
            }}
          >
            Changelog
          </StyledButton>
        </div>
      </div>

      <p className="mt-6 text-balance text-sm">
        {APP_NAME}
        {" "}
        is a free and open-source project. It is licensed under the
        {" "}
        {license}
        {" "}
        License.
      </p>
      <p className="mt-3 text-balance text-sm">
        The icon library used by Follow is mgc which is copyrighted by
        {" "}
        <a
          className="inline-flex cursor-pointer items-center gap-1 hover:underline"
          href="https://mgc.mingcute.com/"
          target="_blank"
          rel="noreferrer"
        >
          https://mgc.mingcute.com/
          <i className="i-mgc-external-link-cute-re" />
        </a>
        {" "}
        and cannot be redistributed.
      </p>

      <p className="mt-3 text-sm">
        {APP_NAME}
        {" "}
        (
        {GIT_COMMIT_SHA.slice(0, 7).toUpperCase()}
        ) currently early
        in development. If you have any feedback or suggestions, please feel
        free to
        {" "}
        <a
          className="inline-flex cursor-pointer items-center gap-1 hover:underline"
          href={getNewIssueUrl()}
          target="_blank"
        >
          open an issue
          <i className="i-mgc-external-link-cute-re" />
        </a>
        {" "}
        on the GitHub.
      </p>

      <Divider className="scale-x-50" />

      <h2 className="text-base font-semibold">
        {/* 社区与资讯 */}
        Social Media
      </h2>
      <div className="mt-2 flex flex-wrap gap-2">
        {SocialMediaLinks.map((link) => (
          <Button
            as="a"
            key={link.url}
            variant="outline"
            className="flex flex-1 cursor-pointer items-center gap-2"
            // @ts-expect-error
            href={link.url}
            target="_blank"
            rel="noreferrer"
          >
            <i className={link.icon} />
            {link.label}
          </Button>
        ))}
      </div>
    </section>
  </div>
)

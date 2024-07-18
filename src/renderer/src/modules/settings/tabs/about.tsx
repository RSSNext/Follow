import { repository } from "@pkg"
import { Logo } from "@renderer/components/icons/logo"
import { StyledButton } from "@renderer/components/ui/button"

export const SettingAbout = () => (
  <div>
    <section>
      <div className="my-4 font-medium text-theme-foreground/60">
        Version
      </div>
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
    </section>
  </div>
)

import { useThemeAtomValue } from "@follow/hooks"
import { useTranslation } from "react-i18next"

import { useSetTheme } from "~/hooks/common"

import { useRegisterCommandEffect } from "../hooks/use-register-command-effect"

export const useRegisterThemeCommands = () => {
  const [t] = useTranslation("settings")
  const theme = useThemeAtomValue()
  const setTheme = useSetTheme()

  useRegisterCommandEffect([
    {
      id: "follow:change-color-mode-to-auto",
      label: `To ${t("appearance.theme.system")}`,
      category: "follow:settings",
      icon: <i className="i-mgc-settings-7-cute-re" />,
      when: theme !== "system",
      run() {
        setTheme("system")
      },
    },
    {
      id: "follow:change-color-mode-to-dark",
      label: `To ${t("appearance.theme.dark")}`,
      category: "follow:settings",
      icon: <i className="i-mingcute-moon-line" />,
      when: theme !== "dark",
      run() {
        setTheme("dark")
      },
    },
    {
      id: "follow:change-color-mode-to-light",
      label: `To ${t("appearance.theme.light")}`,
      category: "follow:settings",
      icon: <i className="i-mingcute-sun-line" />,
      when: theme !== "light",
      run() {
        setTheme("light")
      },
    },
  ])
}

import { Button } from "@follow/components/ui/button/index.js"
import { LoadingCircle } from "@follow/components/ui/loading/index.js"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@follow/components/ui/select/index.jsx"
import { useIsDark, useThemeAtomValue } from "@follow/hooks"
import { IN_ELECTRON } from "@follow/shared/constants"
import { getOS } from "@follow/utils/utils"
import { useForceUpdate } from "framer-motion"
import { lazy, Suspense, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { bundledThemesInfo } from "shiki/themes"

import {
  getUISettings,
  setUISetting,
  useIsZenMode,
  useToggleZenMode,
  useUISettingKey,
  useUISettingSelector,
  useUISettingValue,
} from "~/atoms/settings/ui"
import { useCurrentModal, useModalStack } from "~/components/ui/modal/stacked/hooks"
import { isElectronBuild } from "~/constants"
import { useSetTheme } from "~/hooks/common"

import { SETTING_MODAL_ID } from "../constants"
import {
  SettingActionItem,
  SettingDescription,
  SettingSwitch,
  SettingTabbedSegment,
} from "../control"
import { createDefineSettingItem } from "../helper/builder"
import { createSettingBuilder } from "../helper/setting-builder"
import { SettingItemGroup } from "../section"
import { ContentFontSelector, UIFontSelector } from "../sections/fonts"

const SettingBuilder = createSettingBuilder(useUISettingValue)
const defineItem = createDefineSettingItem(useUISettingValue, setUISetting)

export const SettingAppearance = () => {
  const { t } = useTranslation("settings")
  return (
    <div className="mt-4">
      <SettingBuilder
        settings={[
          {
            type: "title",
            value: t("appearance.general"),
          },
          AppThemeSegment,

          defineItem("opaqueSidebar", {
            label: t("appearance.opaque_sidebars.label"),
            hide: !window.api?.canWindowBlur,
          }),

          {
            type: "title",
            value: t("appearance.unread_count"),
          },

          defineItem("showDockBadge", {
            label: t("appearance.show_dock_badge.label"),
            hide: !IN_ELECTRON || !["macOS", "Linux"].includes(getOS()),
          }),

          defineItem("sidebarShowUnreadCount", {
            label: t("appearance.sidebar_show_unread_count.label"),
          }),

          {
            type: "title",
            value: t("appearance.sidebar"),
          },
          defineItem("hideExtraBadge", {
            label: t("appearance.hide_extra_badge.label"),
            description: t("appearance.hide_extra_badge.description"),
          }),
          ZenMode,
          ThumbnailRatio,
          CustomCSS,

          {
            type: "title",
            value: t("appearance.fonts"),
          },
          TextSize,
          UIFontSelector,
          ContentFontSelector,
          {
            type: "title",
            value: t("appearance.content"),
          },
          ShikiTheme,

          defineItem("guessCodeLanguage", {
            label: t("appearance.guess_code_language.label"),
            hide: !isElectronBuild,
            description: t("appearance.guess_code_language.description"),
          }),

          defineItem("readerRenderInlineStyle", {
            label: t("appearance.reader_render_inline_style.label"),
            description: t("appearance.reader_render_inline_style.description"),
          }),

          defineItem("hideRecentReader", {
            label: t("appearance.hide_recent_reader.label"),
            description: t("appearance.hide_recent_reader.description"),
          }),

          {
            type: "title",
            value: t("appearance.misc"),
          },

          defineItem("modalOverlay", {
            label: t("appearance.modal_overlay.label"),
            description: t("appearance.modal_overlay.description"),
          }),
          defineItem("reduceMotion", {
            label: t("appearance.reduce_motion.label"),
            description: t("appearance.reduce_motion.description"),
          }),
          defineItem("usePointerCursor", {
            label: t("appearance.use_pointer_cursor.label"),
            description: t("appearance.use_pointer_cursor.description"),
          }),
        ]}
      />
    </div>
  )
}

const ShikiTheme = () => {
  const { t } = useTranslation("settings")
  const isDark = useIsDark()
  const codeHighlightThemeLight = useUISettingKey("codeHighlightThemeLight")
  const codeHighlightThemeDark = useUISettingKey("codeHighlightThemeDark")

  return (
    <div className="mb-3 flex items-center justify-between">
      <span className="shrink-0 text-sm font-medium">{t("appearance.code_highlight_theme")}</span>
      <Select
        defaultValue={isDark ? "github-dark" : "github-light"}
        value={isDark ? codeHighlightThemeDark : codeHighlightThemeLight}
        onValueChange={(value) => {
          if (isDark) {
            setUISetting("codeHighlightThemeDark", value)
          } else {
            setUISetting("codeHighlightThemeLight", value)
          }
        }}
      >
        <SelectTrigger size="sm" className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="item-aligned">
          {bundledThemesInfo
            .filter((theme) => theme.type === (isDark ? "dark" : "light"))
            .map((theme) => (
              <SelectItem key={theme.id} value={theme.id}>
                {theme.displayName}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  )
}

const textSizeMap = {
  smaller: 15,
  default: 16,
  medium: 18,
  large: 20,
}

export const TextSize = () => {
  const { t } = useTranslation("settings")
  const uiTextSize = useUISettingSelector((state) => state.uiTextSize)

  return (
    <div className="-mt-1 mb-3 flex items-center justify-between">
      <span className="shrink-0 text-sm font-medium">{t("appearance.text_size")}</span>
      <Select
        defaultValue={textSizeMap.default.toString()}
        value={uiTextSize.toString() || textSizeMap.default.toString()}
        onValueChange={(value) => {
          setUISetting("uiTextSize", Number.parseInt(value) || textSizeMap.default)
        }}
      >
        <SelectTrigger size="sm" className="w-48 capitalize">
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="item-aligned">
          {Object.entries(textSizeMap).map(([size, value]) => (
            <SelectItem className="capitalize" key={size} value={value.toString()}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export const AppThemeSegment = () => {
  const { t } = useTranslation("settings")
  const theme = useThemeAtomValue()
  const setTheme = useSetTheme()

  return (
    <SettingTabbedSegment
      key="theme"
      label={t("appearance.theme.label")}
      value={theme}
      values={[
        {
          value: "system",
          label: t("appearance.theme.system"),
          icon: <i className="i-mingcute-monitor-line" />,
        },
        {
          value: "light",
          label: t("appearance.theme.light"),
          icon: <i className="i-mingcute-sun-line" />,
        },
        {
          value: "dark",
          label: t("appearance.theme.dark"),
          icon: <i className="i-mingcute-moon-line" />,
        },
      ]}
      onValueChanged={(value) => {
        setTheme(value as "light" | "dark" | "system")
      }}
    />
  )
}

const ZenMode = () => {
  const { t } = useTranslation("settings")
  const isZenMode = useIsZenMode()
  const toggleZenMode = useToggleZenMode()
  return (
    <SettingItemGroup>
      <SettingSwitch
        checked={isZenMode}
        className="mt-4"
        onCheckedChange={toggleZenMode}
        label={t("appearance.zen_mode.label")}
      />
      <SettingDescription>{t("appearance.zen_mode.description")}</SettingDescription>
    </SettingItemGroup>
  )
}

const ThumbnailRatio = () => {
  const { t } = useTranslation("settings")

  const thumbnailRatio = useUISettingKey("thumbnailRatio")

  return (
    <SettingItemGroup>
      <div className="mt-4 flex items-center justify-between">
        <span className="shrink-0 text-sm font-medium">
          {t("appearance.thumbnail_ratio.title")}
        </span>
        <Select
          defaultValue="square"
          value={thumbnailRatio}
          onValueChange={(value) => {
            setUISetting("thumbnailRatio", value as "square" | "original")
          }}
        >
          <SelectTrigger size="sm" className="w-48 translate-y-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="item-aligned">
            {["square", "original"].map((ratio) => (
              <SelectItem key={ratio} value={ratio}>
                {t(`appearance.thumbnail_ratio.${ratio as "square" | "original"}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <SettingDescription>{t("appearance.thumbnail_ratio.description")}</SettingDescription>
    </SettingItemGroup>
  )
}

const CustomCSS = () => {
  const { t } = useTranslation("settings")
  const { present } = useModalStack()
  return (
    <SettingItemGroup>
      <SettingActionItem
        label={t("appearance.custom_css.label")}
        action={() => {
          present({
            title: t("appearance.custom_css.label"),
            content: CustomCSSModal,
            clickOutsideToDismiss: false,
            overlay: false,
            resizeable: true,
            resizeDefaultSize: {
              width: 700,
              height: window.innerHeight - 200,
            },
          })
        }}
        buttonText={t("appearance.custom_css.button")}
      />
      <SettingDescription>{t("appearance.custom_css.description")}</SettingDescription>
    </SettingItemGroup>
  )
}
const LazyCSSEditor = lazy(() =>
  import("../../editor/css-editor").then((m) => ({ default: m.CSSEditor })),
)

const CustomCSSModal = () => {
  const initialCSS = useRef(getUISettings().customCSS)
  const { t } = useTranslation("common")
  const { dismiss } = useCurrentModal()
  useEffect(() => {
    return () => {
      setUISetting("customCSS", initialCSS.current)
    }
  }, [])
  useEffect(() => {
    const modal = document.querySelector(`#${SETTING_MODAL_ID}`) as HTMLDivElement
    if (!modal) return
    const prevOverlay = getUISettings().modalOverlay
    setUISetting("modalOverlay", false)

    modal.style.display = "none"
    return () => {
      setUISetting("modalOverlay", prevOverlay)

      modal.style.display = ""
    }
  }, [])
  const [forceUpdate, key] = useForceUpdate()
  return (
    <form
      className="relative flex h-full max-w-full flex-col"
      onSubmit={(e) => {
        e.preventDefault()
        if (initialCSS.current !== getUISettings().customCSS) {
          initialCSS.current = getUISettings().customCSS
        }
        dismiss()
      }}
    >
      <Suspense
        fallback={
          <div className="center flex h-0 grow">
            <LoadingCircle size="large" />
          </div>
        }
      >
        <LazyCSSEditor
          defaultValue={initialCSS.current}
          key={key}
          className="h-0 grow rounded-lg border p-3 font-mono"
          onChange={(value) => {
            setUISetting("customCSS", value)
          }}
        />
      </Suspense>

      <div className="mt-2 flex shrink-0 justify-end gap-2">
        <Button
          variant="outline"
          onClick={(e) => {
            e.preventDefault()

            setUISetting("customCSS", initialCSS.current)

            forceUpdate()
          }}
        >
          {t("words.reset")}
        </Button>
        <Button type="submit">{t("words.save")}</Button>
      </div>
    </form>
  )
}

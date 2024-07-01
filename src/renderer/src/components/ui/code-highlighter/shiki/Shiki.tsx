/* eslint-disable @eslint-react/dom/no-dangerously-set-innerhtml */
import { useUISettingSelector } from "@renderer/atoms"
import { cn } from "@renderer/lib/utils"
import type { FC } from "react"
import { useLayoutEffect, useMemo, useRef, useState } from "react"
import type {
  BundledLanguage,
  BundledTheme,
  DynamicImportLanguageRegistration,
  DynamicImportThemeRegistration,
} from "shiki"
import { createHighlighterCore } from "shiki/core"
import { default as getWasm } from "shiki/wasm"

import { CopyButton } from "../copy-button"
import { shikiTransformers } from "./shared"
import styles from "./shiki.module.css"

const shiki = await createHighlighterCore({
  themes: [

    import("shiki/themes/github-dark.mjs"),
  ],
  langs: [],
  loadWasm: getWasm,
})

export interface ShikiProps {
  language: string | undefined
  code: string

  attrs?: string
  className?: string

  transparent?: boolean

  theme?: string
}

let langModule: Record<
  BundledLanguage,
  DynamicImportLanguageRegistration
> | null = null
let themeModule: Record<BundledTheme, DynamicImportThemeRegistration> | null =
  null

export const ShikiHighLighter: FC<ShikiProps> = (props) => {
  const { code, language, className, theme: overrideTheme } = props
  const loadThemesRef = useRef([] as string[])
  const loadLanguagesRef = useRef([] as string[])

  const [loaded, setLoaded] = useState(false)

  const codeTheme = useUISettingSelector((s) => overrideTheme || s.codeHighlightTheme)
  useLayoutEffect(() => {
    let isMounted = true
    setLoaded(false)

    async function loadShikiLanguage(language: string, languageModule: any) {
      if (!shiki) return
      if (!shiki.getLoadedLanguages().includes(language)) {
        await shiki.loadLanguage(await languageModule())
      }
    }
    async function loadShikiTheme(theme: string, themeModule: any) {
      if (!shiki) return
      if (!shiki.getLoadedThemes().includes(theme)) {
        await shiki.loadTheme(await themeModule())
      }
    }

    async function register() {
      if (!language || !codeTheme) return

      const [{ bundledLanguages }, { bundledThemes }] =
        langModule && themeModule ?
            [
              {
                bundledLanguages: langModule,
              },
              { bundledThemes: themeModule },
            ] :
          await Promise.all([import("shiki/langs"), import("shiki/themes")])

      langModule = bundledLanguages
      themeModule = bundledThemes

      if (
        language &&
        loadLanguagesRef.current.includes(language) &&
        codeTheme &&
        (loadThemesRef.current.includes(codeTheme))
      ) {
        return
      }
      return Promise.all([
        (async () => {
          if (language) {
            const importFn = (bundledLanguages as any)[language]
            if (!importFn) return
            await loadShikiLanguage(language || "", importFn)
            loadLanguagesRef.current.push(language)
          }
        })(),
        (async () => {
          if (codeTheme) {
            const importFn = (bundledThemes as any)[codeTheme]
            if (!importFn) return
            await loadShikiTheme(codeTheme || "", importFn)
            loadThemesRef.current.push(codeTheme)
          }
        })(),
      ])
    }
    register().then(() => {
      if (isMounted) {
        setLoaded(true)
      }
    })
    return () => {
      isMounted = false
    }
  }, [codeTheme, language])

  if (!loaded) {
    return (
      <pre className={className}>
        <code>{code}</code>
      </pre>
    )
  }
  return <ShikiCode {...props} codeTheme={codeTheme} />
}

const ShikiCode: FC<ShikiProps & {
  codeTheme: string

}> = ({ code, language, codeTheme, className, transparent }) => {
  const rendered = useMemo(() => {
    try {
      return shiki.codeToHtml(code, {
        lang: language!,
        themes: {
          dark: codeTheme,
          light: codeTheme,
        },
        transformers: shikiTransformers,
      })
    } catch {
      // console.error(err)
      return null
    }
  }, [code, language, codeTheme])

  if (!rendered) {
    return (
      <pre className={className}>
        <code>{code}</code>
      </pre>
    )
  }
  return (
    <div className={cn("group relative", styles["shiki-wrapper"], transparent ? styles["transparent"] : null, className)}>
      <div dangerouslySetInnerHTML={{ __html: rendered }} />
      <CopyButton value={code} className="absolute right-1 top-1 opacity-0 duration-200 group-hover:opacity-100" />
    </div>
  )
}

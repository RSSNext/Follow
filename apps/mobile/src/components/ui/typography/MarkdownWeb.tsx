"use dom"
import "@/src/global.css"

import { parseMarkdown } from "@follow/components/src/utils/parse-markdown"
import { cn } from "@follow/utils"
import { useMemo } from "react"
import { useDarkMode } from "usehooks-ts"

import { useCSSInjection } from "@/src/theme/web"

const MarkdownWeb: WebComponent<{ value: string; style?: React.CSSProperties }> = ({
  value,
  style,
}) => {
  useCSSInjection()

  const { isDarkMode } = useDarkMode()
  return (
    <div
      className={cn("text-text prose min-w-0", isDarkMode ? "prose-invert" : "prose")}
      style={style}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        body, html {
            height: 100%;
            overflow: hidden;
          }
        `,
        }}
      />
      {useMemo(() => parseMarkdown(value).content, [value])}
    </div>
  )
}

export default MarkdownWeb

"use dom"
import "@/src/global.css"

import { parseMarkdown } from "@follow/components/src/utils/parse-markdown"
import { cn } from "@follow/utils"
import { useDarkMode } from "usehooks-ts"

import { useCSSInjection } from "@/src/theme/web"

const MarkdownWeb: WebComponent<{ value: string }> = ({ value }) => {
  useCSSInjection()

  const { isDarkMode } = useDarkMode()
  return (
    <div className={cn("text-text prose min-w-0", isDarkMode ? "prose-invert" : "prose")}>
      {parseMarkdown(value).content}
    </div>
  )
}

export default MarkdownWeb

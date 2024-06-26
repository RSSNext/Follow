/* eslint-disable @eslint-react/dom/no-dangerously-set-innerhtml */
import { cn } from "@renderer/lib/utils"
import markdownit from "markdown-it"
import { useMemo } from "react"

import styles from "./index.module.css"
import { createContainer } from "./plugins/container"

const md = markdownit()
  .use(...createContainer("tip", "TIP", () => md))
  .use(...createContainer("info", "INFO", () => md))
  .use(...createContainer("warning", "WARNING", () => md))
  .use(...createContainer("danger", "DANGER", () => md))
  .use(...createContainer("details", "Details", () => md))

export const Markdown: Component<{
  children: string
}> = (props) => (
  <div
    className={cn(styles.markdown, props.className, "prose dark:prose-invert prose-th:text-left")}
    dangerouslySetInnerHTML={useMemo(
      () => ({
        __html: md.render(props.children as string),
      }),
      [props.children],
    )}
  />
)

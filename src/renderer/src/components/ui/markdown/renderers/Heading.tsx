import { springScrollToElement } from "@renderer/lib/scroller"
import { cn } from "@renderer/lib/utils"
import { useId } from "react"

import { useScrollViewElement } from "../../scroll-area/hooks"

export const createHeadingRenderer =
  (level: number) =>
    (
      props: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLHeadingElement>,
        HTMLHeadingElement
      >,
    ) => {
      const rid = useId()

      const As = `h${level}` as any
      const { node, ...rest } = props as any
      const finalId = rest.id || rid

      const scroller = useScrollViewElement()
      return (
        <As
          {...rest}
          id={finalId}
          className={cn(rest.className, "group relative")}
        >
          {rest.children}
          <span
            className={cn(
              "cursor-pointer select-none text-accent opacity-0 transition-opacity duration-200 group-hover:opacity-100",
              "relative ml-2",
              "@2xl:absolute @2xl:left-[-1.5em] @2xl:top-0 @2xl:opacity-0",
            )}
            aria-hidden
            onClick={() => {
              springScrollToElement(
              // eslint-disable-next-line unicorn/prefer-query-selector
                document.getElementById(finalId)!,
                -100,
                scroller!,
              )
            }}
          >
            <i className="i-mingcute-hashtag-line invisible" />
            <span className="center absolute inset-0">
              <i className="i-mingcute-hashtag-line" />
            </span>
          </span>
        </As>
      )
    }

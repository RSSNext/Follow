import type { FC } from "react"
import { createElement, forwardRef } from "react"

type WithSelect<T> = T & {
  select: (s: any) => any
}

export const withSettingEnabled =
  <SE,>(
    useSettings: WithSelect<() => SE>,
    condition: (setting: SE) => boolean,
  ) =>
    <P extends JSX.IntrinsicAttributes>(
      IfComponent: FC<P> | keyof JSX.IntrinsicElements,
      ElseComponent: FC<P> | keyof JSX.IntrinsicElements,
    ) =>
      forwardRef<any, P>((props, ref) => {
        const res = useSettings.select(condition)
        return res ?
          createElement(IfComponent, { ...props, ref }) :
          createElement(ElseComponent, { ...props, ref })
      })

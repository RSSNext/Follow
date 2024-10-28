"use dom"

import type { PropsWithChildren } from "react"

export default function WebContainer(props: PropsWithChildren) {
  return (
    <div>
      <h1 style={{ color: "red" }}>Hello, </h1>
      {props.children}
    </div>
  )
}

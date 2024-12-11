"use dom"

import "@follow/components/assets/colors.css"
import "@follow/components/assets/tailwind.css"

import { Button } from "@follow/components"
import { useAtomValue } from "jotai"
import type { PropsWithChildren } from "react"

import { jotaiStore, testAtom } from "~/atoms"

export default function WebContainer(props: PropsWithChildren) {
  const a = useAtomValue(testAtom, { store: jotaiStore })

  return (
    <div
      data-theme="light"
      className="text-4xl text-accent"
      style={{
        marginTop: "12rem",
      }}
    >
      <Button>123</Button>
      222 {JSON.stringify(a)}
      <h1 style={{ color: "red" }}>Hello, </h1>
    </div>
  )
}

/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference types="@welldone-software/why-did-you-render" />
import whyDidYouRender from "@welldone-software/why-did-you-render"
import * as React from "react"

if (import.meta.env.DEV) {
  whyDidYouRender(React as any, {
    trackAllPureComponents: true,
  })
}

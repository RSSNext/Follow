import type { ReactEventHandler } from "react"

export const stopPropagation: ReactEventHandler<any> = (e) => e.stopPropagation()

export const preventDefault: ReactEventHandler<any> = (e) => e.preventDefault()

export const nextFrame = (fn: (...args: any[]) => any) => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      fn()
    })
  })
}

export const getElementTop = (element: HTMLElement) => {
  let actualTop = element.offsetTop
  let current = element.offsetParent as HTMLElement
  while (current !== null) {
    actualTop += current.offsetTop
    current = current.offsetParent as HTMLElement
  }
  return actualTop
}

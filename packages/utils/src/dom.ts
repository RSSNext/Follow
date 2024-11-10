export const stopPropagation = <T extends { stopPropagation: () => any }>(e: T) =>
  e.stopPropagation()

export const preventDefault = <T extends { preventDefault: () => any }>(e: T) => e.preventDefault()

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

export const clearSelection = () => window.getSelection()?.removeAllRanges()

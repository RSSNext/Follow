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

export const findElementInShadowDOM = (selector: string): HTMLElement | null => {
  const element = document.querySelector(selector)
  if (element) return element as HTMLElement

  // find in all shadow roots
  const getAllShadowRoots = (root: Document | Element | ShadowRoot): Element[] => {
    const hosts = Array.from(root.querySelectorAll("*")).filter((el) => el.shadowRoot)

    return hosts.reduce((acc, host) => {
      if (host.shadowRoot) {
        const shadowElement = host.shadowRoot.querySelector(selector)
        if (shadowElement) acc.push(shadowElement)
        return [...acc, ...getAllShadowRoots(host.shadowRoot)]
      }
      return acc
    }, [] as Element[])
  }

  const results = getAllShadowRoots(document)
  return (results[0] as HTMLElement) || null
}

export function composeEventHandlers<E>(
  originalEventHandler?: ((event: E) => void) | null,
  ourEventHandler?: ((event: E) => void) | null,
  { checkForDefaultPrevented = true } = {},
) {
  return function handleEvent(event: E) {
    originalEventHandler?.(event)

    if (checkForDefaultPrevented === false || !(event as unknown as Event).defaultPrevented) {
      return ourEventHandler?.(event)
    }
  }
}

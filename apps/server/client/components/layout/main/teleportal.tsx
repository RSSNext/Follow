import { atom, useAtomValue, useSetAtom } from "jotai"
import type { FC, PropsWithChildren } from "react"
import { Fragment } from "react"
import { createPortal } from "react-dom"

const portalAtoms = atom(null as HTMLElement | null)
export const TeleportalDestination = () => {
  const setPortal = useSetAtom(portalAtoms)

  return (
    <Fragment>
      <div className="flex flex-col" ref={setPortal} />
    </Fragment>
  )
}

export const TeleportalTakeOff: FC<PropsWithChildren> = ({ children }) => {
  const portal = useAtomValue(portalAtoms)

  if (!portal) return null

  return createPortal(children, portal)
}

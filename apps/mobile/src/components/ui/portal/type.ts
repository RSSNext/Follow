import type * as React from "react"

export type PortalKey = string
export interface IPortalManager {
  mount: (key: PortalKey, children: React.ReactNode) => void
  update: (key: PortalKey, children: React.ReactNode) => void
  unmount: (key: PortalKey) => void
}

export interface IPortalMethods {
  mount: (children: React.ReactNode) => PortalKey
  update: (key: PortalKey, children: React.ReactNode) => void
  unmount: (key: PortalKey) => void
}

export type Operation =
  | {
      type: "mount"
      key: PortalKey
      children: React.ReactNode
    }
  | {
      type: "update"
      key: PortalKey
      children: React.ReactNode
    }
  | {
      type: "unmount"
      key: PortalKey
    }

export interface IStaticContainerProps {
  shouldUpdate: boolean
  children: React.ReactNode
}

export interface PortalProps {
  children?: React.ReactNode
}

export interface PortalConsumerProps {
  manager: IPortalMethods | null
  children: React.ReactNode
}

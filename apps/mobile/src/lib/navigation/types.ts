import type { FC } from "react"
import type { StackPresentationTypes } from "react-native-screens"

export interface NavigationPushOptions<T> {
  Component?: NavigationControllerView<T>
  element?: React.ReactElement

  /**
   * Override the id for the view.
   */
  id?: string
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type NavigationControllerView<P = {}> = FC<P> & {
  /**
   * Unique identifier for the view.
   */
  id?: string
}

export type NavigationControllerViewType = StackPresentationTypes

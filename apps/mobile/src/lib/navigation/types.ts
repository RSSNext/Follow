import type { FC } from "react"
import type { StackPresentationTypes } from "react-native-screens"

export interface NavigationPushOptions<T> {
  Component?: NavigationControllerView<T>
  element?: React.ReactElement
}
export type NavigationControllerViewExtraProps = {
  /**
   * Unique identifier for the view.
   */
  id?: string

  /**
   * Title for the view.
   */
  title?: string

  /**
   * Whether the view is transparent.
   */
  transparent?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type NavigationControllerView<P = {}> = FC<P> & NavigationControllerViewExtraProps
export type NavigationControllerViewType = StackPresentationTypes

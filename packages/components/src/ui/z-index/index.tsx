import { ZIndexContext } from "./ctx"

export const ZIndexProvider: Component<{
  zIndex: number
}> = (props) => {
  return <ZIndexContext.Provider value={props.zIndex}>{props.children}</ZIndexContext.Provider>
}

// import type { FC } from "react"
// import { forwardRef } from "react"

// import { useAb } from "~/hooks/biz/useAb"

// import type { FeatureKeys } from "./atoms"

// const Noop = () => null
// export const withFeature =
//   (feature: FeatureKeys) =>
//   <T extends object>(
//     Component: FC<T>,

//     FallbackComponent: any = Noop,
//   ) => {
//     // @ts-expect-error
//     const WithFeature = forwardRef((props: T, ref: any) => {
//       const isEnabled = useAb(feature)

//       if (isEnabled === undefined) return null

//       return isEnabled ? (
//         <Component {...props} ref={ref} />
//       ) : (
//         <FallbackComponent {...props} ref={ref} />
//       )
//     })

//     return WithFeature
//   }

export {}

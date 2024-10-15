// import { useAtomValue } from "jotai"
// import PostHog from "posthog-js"
// import { useFeatureFlagEnabled } from "posthog-js/react"

// import { jotaiStore } from "~/lib/jotai"
// import type { FeatureKeys } from "~/modules/ab/atoms"
// import { debugFeaturesAtom, enableDebugOverrideAtom, IS_DEBUG_ENV } from "~/modules/ab/atoms"
// import { abPayloadFallback } from "~/modules/ab/fallback"

// export const useAb = (feature: FeatureKeys) => {
//   const isEnableDebugOverrides = useAtomValue(enableDebugOverrideAtom)
//   const debugFeatureOverrides = useAtomValue(debugFeaturesAtom)

//   const isEnabled = useFeatureFlagEnabled(feature)

//   if (IS_DEBUG_ENV && isEnableDebugOverrides) return debugFeatureOverrides[feature]

//   return isEnabled
// }

// export const isAbEnabled = (feature: FeatureKeys) => {
//   const featureFlag = PostHog.getFeatureFlag(feature)
//   const enabled = typeof featureFlag === "boolean" ? featureFlag : featureFlag === "enabled"
//   const debugOverride = jotaiStore.get(debugFeaturesAtom)

//   const isEnableOverride = jotaiStore.get(enableDebugOverrideAtom)

//   if (isEnableOverride) {
//     return debugOverride[feature]
//   }

//   return enabled
// }

// export const getAbValue = (feature: FeatureKeys) => {
//   return PostHog.getFeatureFlagPayload(feature) || abPayloadFallback[feature]
// }

export {}

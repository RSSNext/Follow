import { useAtomValue } from "jotai"
import PostHog from "posthog-js"
import { useFeatureFlagEnabled } from "posthog-js/react"

import { jotaiStore } from "~/lib/jotai"
import type { FeatureKeys } from "~/modules/ab/atoms"
import { debugFeaturesAtom, enableDebugOverrideAtom, IS_DEBUG_ENV } from "~/modules/ab/atoms"

export const useAb = (feature: FeatureKeys) => {
  const isEnableDebugOverrides = useAtomValue(enableDebugOverrideAtom)
  const debugFeatureOverrides = useAtomValue(debugFeaturesAtom)

  const isEnabled = useFeatureFlagEnabled(feature)

  if (IS_DEBUG_ENV && isEnableDebugOverrides) return debugFeatureOverrides[feature]

  return isEnabled
}

export const getAbValue = (feature: FeatureKeys) => {
  const enabled = PostHog.getFeatureFlag(feature)
  const debugOverride = jotaiStore.get(debugFeaturesAtom)

  const isEnableOverride = jotaiStore.get(enableDebugOverrideAtom)

  if (isEnableOverride) {
    return debugOverride[feature]
  }

  return enabled
}

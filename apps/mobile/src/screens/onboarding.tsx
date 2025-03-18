import { useCallback, useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { SheetScreen } from "react-native-sheet-transitions"

import { kv } from "../lib/kv"
import { useNavigation } from "../lib/navigation/hooks"
import type { NavigationControllerView } from "../lib/navigation/types"
import { queryClient } from "../lib/query-client"
import { StepFinished } from "../modules/onboarding/step-finished"
import { StepInterests } from "../modules/onboarding/step-interests"
import { StepPreferences } from "../modules/onboarding/step-preferences"
import { StepWelcome } from "../modules/onboarding/step-welcome"
import { isNewUserQueryKey, isOnboardingFinishedStorageKey } from "../store/user/constants"

export const OnboardingScreen: NavigationControllerView = () => {
  const insets = useSafeAreaInsets()
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4

  const navigation = useNavigation()
  const handleNext = useCallback(() => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete onboarding
      kv.set(isOnboardingFinishedStorageKey, "true")
      queryClient.invalidateQueries({ queryKey: isNewUserQueryKey }).then(() => {
        navigation.back()
      })
    }
  }, [currentStep, navigation])

  return (
    <SheetScreen
      onClose={() => {
        navigation.back()
      }}
    >
      <View
        style={{ paddingTop: insets.top }}
        className="p-safe bg-system-grouped-background flex-1 px-6"
      >
        <ProgressIndicator
          currentStep={currentStep}
          totalSteps={totalSteps}
          setCurrentStep={setCurrentStep}
        />

        {/* Content */}
        {currentStep === 1 && <StepWelcome />}
        {currentStep === 2 && <StepPreferences />}
        {currentStep === 3 && <StepInterests />}
        {currentStep === 4 && <StepFinished />}

        {/* Navigation buttons */}
        <View className="mb-6 px-6" style={{ marginBottom: insets.bottom || 24 }}>
          <TouchableOpacity
            onPress={handleNext}
            className="bg-accent w-full items-center rounded-xl py-4"
          >
            <Text className="text-lg font-bold text-white">
              {currentStep < totalSteps - 1
                ? "Next"
                : currentStep === totalSteps - 1
                  ? "Finish Setup"
                  : "Let's Go!"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SheetScreen>
  )
}

function ProgressIndicator({
  currentStep,
  totalSteps,
  setCurrentStep,
}: {
  currentStep: number
  totalSteps: number
  setCurrentStep: (step: number) => void
}) {
  return (
    <View className="mb-6 mt-4 flex flex-row justify-center gap-2">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <TouchableOpacity
          key={`step-${index}-indicator`}
          onPress={() => {
            setCurrentStep(index + 1)
          }}
        >
          <View
            className={`mx-1 h-2 w-10 rounded-full ${
              currentStep >= index + 1 ? "bg-accent" : "bg-gray-300"
            }`}
          />
        </TouchableOpacity>
      ))}
    </View>
  )
}

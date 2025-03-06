import { useMutation } from "@tanstack/react-query"
import { useRouter } from "expo-router"
import { useMemo, useState } from "react"
import { View } from "react-native"

import { ModalHeaderSubmitButton } from "@/src/components/common/ModalSharedComponents"
import { ModalHeader } from "@/src/components/layouts/header/ModalHeader"
import { SafeModalScrollView } from "@/src/components/layouts/views/SafeModalScrollView"
import { PlainTextField } from "@/src/components/ui/form/TextField"
import {
  GroupedInsetListCard,
  GroupedInsetListCell,
  GroupedInsetListSectionHeader,
  GroupedOutlineDescription,
  GroupedPlainButtonCell,
} from "@/src/components/ui/grouped/GroupedList"
import { toast } from "@/src/lib/toast"
import { useWhoami } from "@/src/store/user/hooks"
import { userSyncService } from "@/src/store/user/store"

const EditEmailScreen = () => {
  const whoami = useWhoami()

  const [email, setEmail] = useState(whoami?.email ?? "")

  const [isDirty, setIsDirty] = useState(false)
  const isValidate = whoami?.emailVerified

  const newEmailIsValid = useMemo(() => {
    return email.match(/^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/)
  }, [email])

  const navigation = useRouter()
  const { mutate: updateEmail, isPending } = useMutation({
    mutationFn: async () => {
      await userSyncService.updateEmail(email)
    },
    onSuccess: () => {
      toast.info("Please check your email inbox to verify your new email")
      navigation.dismiss()
    },
  })

  return (
    <SafeModalScrollView className="bg-system-grouped-background">
      <ModalHeader
        headerTitle="Edit Email"
        headerRight={
          <ModalHeaderSubmitButton
            isLoading={isPending}
            isValid={!!(email && newEmailIsValid && isDirty)}
            onPress={() => {
              updateEmail()
            }}
          />
        }
      />

      <View className="mt-8 w-full">
        <GroupedInsetListSectionHeader label="Email" />
        <GroupedInsetListCard>
          <GroupedInsetListCell label="Email" rightClassName="flex-1" leftClassName="flex-none">
            <PlainTextField
              autoCapitalize="none"
              value={email}
              onChangeText={(text) => {
                setEmail(text)
                setIsDirty(true)
              }}
              placeholder="Enter your email"
              className="text-secondary-label w-full flex-1 text-left"
            />
          </GroupedInsetListCell>
        </GroupedInsetListCard>
        <GroupedOutlineDescription
          description={`Your email is ${isValidate ? "verified" : "not verified"}. \n\nIf you want to change your email, you should verify your new email.`}
        />

        {/* Buttons */}

        {!isValidate && (
          <GroupedInsetListCard className="mt-6">
            <GroupedPlainButtonCell label="Send Verification Email" />
          </GroupedInsetListCard>
        )}
      </View>
    </SafeModalScrollView>
  )
}
export default EditEmailScreen

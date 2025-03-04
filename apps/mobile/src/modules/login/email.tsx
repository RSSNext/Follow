import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { router } from "expo-router"
import type { Control } from "react-hook-form"
import { useController, useForm } from "react-hook-form"
import type { TextInputProps } from "react-native"
import { TextInput, View } from "react-native"
import { KeyboardController } from "react-native-keyboard-controller"
import { z } from "zod"

import { SubmitButton } from "@/src/components/common/SubmitButton"
import { signIn } from "@/src/lib/auth"
import { toast } from "@/src/lib/toast"
import { accentColor } from "@/src/theme/colors"

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
})

type FormValue = z.infer<typeof formSchema>

async function onSubmit(values: FormValue) {
  await signIn
    .email({
      email: values.email,
      password: values.password,
    })
    .then((res) => {
      if (res.error) {
        throw new Error(res.error.message)
      }
      // @ts-expect-error
      if (res.data.twoFactorRedirect) {
        router.push("/2fa")
      }
    })
    .catch((error) => {
      toast.error(`Failed to login: ${error.message}`)
    })
}

function Input({
  control,
  name,
  ...rest
}: TextInputProps & {
  control: Control<FormValue>
  name: keyof FormValue
}) {
  const { field } = useController({
    control,
    name,
  })
  return (
    <TextInput
      selectionColor={accentColor}
      {...rest}
      value={field.value}
      onChangeText={field.onChange}
    />
  )
}

export function EmailLogin() {
  const { control, handleSubmit, formState } = useForm<FormValue>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const submitMutation = useMutation({
    mutationFn: onSubmit,
  })

  const login = handleSubmit((values) => {
    submitMutation.mutate(values)
  })

  return (
    <View className="mx-auto flex w-full max-w-sm gap-6">
      <View className="bg-secondary-system-background gap-4 rounded-2xl px-6 py-4">
        <View className="flex-row">
          <Input
            hitSlop={20}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            autoComplete="email"
            control={control}
            name="email"
            placeholder="Email"
            className="text-text flex-1"
            returnKeyType="next"
            onSubmitEditing={() => {
              KeyboardController.setFocusTo("next")
            }}
          />
        </View>
        <View className="border-b-opaque-separator border-b-hairline" />
        <View className="flex-row">
          <Input
            hitSlop={20}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="current-password"
            control={control}
            name="password"
            placeholder="Password"
            className="text-text flex-1"
            secureTextEntry
            returnKeyType="go"
            onSubmitEditing={() => {
              login()
            }}
          />
        </View>
      </View>
      <SubmitButton
        disabled={submitMutation.isPending || !formState.isValid}
        isLoading={submitMutation.isPending}
        onPress={login}
        title="Continue"
        className="mt-8"
      />
    </View>
  )
}

import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import type { Control } from "react-hook-form"
import { useController, useForm } from "react-hook-form"
import type { TextInputProps } from "react-native"
import { ActivityIndicator, TextInput, TouchableOpacity, View } from "react-native"
import { z } from "zod"

import { ThemedText } from "@/src/components/common/ThemedText"
import { signIn } from "@/src/lib/auth"

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
})

type FormValue = z.infer<typeof formSchema>

async function onSubmit(values: FormValue) {
  await signIn.email({
    email: values.email,
    password: values.password,
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
  return <TextInput {...rest} value={field.value} onChangeText={field.onChange} />
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

  return (
    <View className="mx-auto flex w-full max-w-sm gap-6">
      <View className="gap-4">
        <Input
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          autoComplete="email"
          placeholder="Email"
          control={control}
          name="email"
          className="border-gray-3 placeholder:font-sn placeholder:text-placeholder-text rounded-lg border px-3 py-2 focus:border-accent"
        />
        <Input
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="current-password"
          placeholder="Password"
          control={control}
          name="password"
          secureTextEntry
          className="border-gray-3 placeholder:font-sn placeholder:text-placeholder-text rounded-lg border px-3 py-2 focus:border-accent"
        />
      </View>
      <TouchableOpacity
        disabled={submitMutation.isPending || !formState.isValid}
        onPress={handleSubmit((values) => submitMutation.mutate(values))}
        className="disabled:bg-gray-3 rounded-lg bg-accent p-3"
      >
        {submitMutation.isPending ? (
          <ActivityIndicator className="text-white" />
        ) : (
          <ThemedText className="text-center text-white">Continue with Email</ThemedText>
        )}
      </TouchableOpacity>
    </View>
  )
}

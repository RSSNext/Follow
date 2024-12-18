import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import type { Control } from "react-hook-form"
import { useController, useForm } from "react-hook-form"
import type { TextInputProps } from "react-native"
import { ActivityIndicator, Button, TextInput, View } from "react-native"
import { z } from "zod"

import { signIn } from "@/src/lib/auth"

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().max(128),
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
  const { control, handleSubmit } = useForm<FormValue>({
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
    <View className="flex w-full gap-6">
      <View className="mx-auto w-full max-w-sm gap-4">
        <Input
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          autoComplete="email"
          placeholder="Email"
          control={control}
          name="email"
          className="rounded-lg border border-gray-6 px-3 py-2"
        />
        <Input
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="current-password"
          placeholder="Password"
          control={control}
          name="password"
          className="rounded-lg border border-gray-6 px-3 py-2"
        />
      </View>
      {submitMutation.isPending ? (
        <ActivityIndicator />
      ) : (
        <Button
          title="Login"
          disabled={submitMutation.isPending}
          onPress={handleSubmit((values) => submitMutation.mutate(values))}
        />
      )}
    </View>
  )
}

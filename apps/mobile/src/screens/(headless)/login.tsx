import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { Redirect } from "expo-router"
import type { Control } from "react-hook-form"
import { useController, useForm } from "react-hook-form"
import type { TextInputProps } from "react-native"
import { ActivityIndicator, Button, TextInput, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { z } from "zod"

import { ThemedText } from "@/src/components/common/ThemedText"
import { Logo } from "@/src/components/ui/logo"
import { signIn, useAuthToken } from "@/src/lib/auth"

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

export default function App() {
  const { data: token } = useAuthToken()

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

  if (token) {
    return <Redirect href="/" />
  }

  return (
    <SafeAreaView className="flex-1 items-center justify-center gap-10">
      <Logo style={{ width: 100, height: 100 }} />
      <ThemedText className="text-2xl font-bold">Login to Follow</ThemedText>
      <View className="w-full max-w-sm gap-4 px-10">
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
    </SafeAreaView>
  )
}

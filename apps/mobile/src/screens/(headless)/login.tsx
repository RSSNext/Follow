import { zodResolver } from "@hookform/resolvers/zod"
import { Redirect } from "expo-router"
import * as React from "react"
import type { Control } from "react-hook-form"
import { useController, useForm } from "react-hook-form"
import type { TextInputProps } from "react-native"
import { Button, TextInput } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { z } from "zod"

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

  if (token) {
    return <Redirect href="/" />
  }

  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <Input
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        autoComplete="email"
        placeholder="Email"
        control={control}
        name="email"
      />
      <Input
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="current-password"
        placeholder="Password"
        control={control}
        name="password"
      />
      <Button title="Login" onPress={handleSubmit(onSubmit)} />
    </SafeAreaView>
  )
}

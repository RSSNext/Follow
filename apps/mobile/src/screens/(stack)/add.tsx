import * as Linking from "expo-linking"
import { Stack } from "expo-router"
import { Text } from "react-native"

export default function Add() {
  // To test this screen, try running the following command in your terminal:
  // `pnpx uri-scheme open 'follow://add?id=1' --ios`
  // See also https://docs.expo.dev/versions/latest/sdk/linking/
  const url = Linking.useURL()
  if (!url) {
    return <Text>Open this screen with a URL</Text>
  }

  const { queryParams } = Linking.parse(url)
  if (!queryParams) return
  const id = queryParams["id"] ?? undefined
  const isList = queryParams["type"] === "list"
  // const urlParam = queryParams["url"] ?? undefined
  if (!id) {
    return <Text>Invalid URL</Text>
  }
  alert(`Linked to app with url: ${url}, follow ${JSON.stringify({ isList, id })}`)

  return (
    <Text>
      Add {url}
      <Stack.Screen
        options={{
          headerBackTitle: "Back",
        }}
      />
    </Text>
  )
}

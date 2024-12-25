import { Redirect, useRootNavigationState, useRouter } from "expo-router"

export default function Add() {
  const navigationState = useRootNavigationState()
  const router = useRouter()

  // Check if root page exists in navigation state
  const hasRootPage = navigationState?.routes?.some(
    (route: { key: string; name: string }) => route.name === "(headless)",
  )

  if (hasRootPage) {
    // If we have root page in stack, go back
    router.back()
    return null
  }

  return <Redirect href="/" />
}

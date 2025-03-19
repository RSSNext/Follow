import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary"
import { Text, View } from "react-native"

const ErrorBoundaryFallback = ({ error }: { error: Error }) => {
  return (
    <View>
      <Text>{error.message}</Text>
    </View>
  )
}

export const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReactErrorBoundary fallbackRender={({ error }) => <ErrorBoundaryFallback error={error} />}>
      {children}
    </ReactErrorBoundary>
  )
}

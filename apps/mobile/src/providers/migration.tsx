import { migrate } from "drizzle-orm/expo-sqlite/migrator"
import type { ReactNode } from "react"
import { useSyncExternalStore } from "react"
import { Text, View } from "react-native"

import migrations from "../../drizzle/migrations"
import { LoadingIndicator } from "../components/ui/loading"
import { db } from "../database"
import { BugCuteReIcon } from "../icons/bug_cute_re"

let storeChangeFn: () => void
const subscribe = (onStoreChange: () => void) => {
  storeChangeFn = onStoreChange

  return () => {
    storeChangeFn = () => {}
  }
}
const migrateStore = {
  success: false,
  error: null as Error | null,
}
migrate(db, migrations)
  .then(() => {
    migrateStore.success = true
    storeChangeFn?.()
  })
  .catch((error) => {
    migrateStore.error = error
    storeChangeFn?.()
  })

const getSnapshot = () => {
  return migrateStore
}
const getServerSnapshot = () => {
  return migrateStore
}
export const MigrationProvider = ({ children }: { children: ReactNode }) => {
  const { success, error } = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <BugCuteReIcon color="#ff0000" height={48} width={48} />
        <Text className="mt-5">Oops, something went wrong...</Text>
        <View className="mt-2 rounded-md bg-system-grouped-background p-2">
          <Text className="font-mono">{error.message}</Text>
        </View>
      </View>
    )
  }

  if (!success) {
    return (
      <View className="flex-1 items-center justify-center">
        <LoadingIndicator>
          <Text>Database Migrations...</Text>
        </LoadingIndicator>
      </View>
    )
  }

  return <>{children}</>
}

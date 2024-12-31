import { cn, regexpPathToPath } from "@follow/utils"
import type { FC } from "react"
import { useMemo } from "react"
import type { UseFormReturn } from "react-hook-form"
import { Clipboard, Text, View } from "react-native"

import { CopyButton } from "@/src/components/common/CopyButton"

export const PreviewUrl: FC<{
  watch: UseFormReturn<any>["watch"]
  path: string
  routePrefix: string
  className?: string
}> = ({ watch, path, routePrefix, className }) => {
  const data = watch()

  const fullPath = useMemo(() => {
    try {
      return regexpPathToPath(path, data)
    } catch (err: unknown) {
      console.info((err as Error).message)
      return path
    }
  }, [path, data])

  const renderedPath = `rsshub://${routePrefix}${fullPath}`
  return (
    <View className={cn("relative min-w-0", className)}>
      <Text className="text-text/80 w-full whitespace-pre-line break-words">{renderedPath}</Text>
      <CopyButton
        onCopy={() => {
          Clipboard.setString(renderedPath)
        }}
        className="absolute right-0 top-0"
      />
    </View>
  )
}

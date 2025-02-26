import { cn } from "@follow/utils/src/utils"
import { Text, View } from "react-native"

import { ProxiedImage } from "../image/ProxiedImage"

interface UserAvatarProps {
  image?: string | null
  size?: number
  name: string
  className?: string
}
export const UserAvatar = ({ image, size = 24, name, className }: UserAvatarProps) => {
  if (!image) {
    return (
      <View
        className={cn(
          "bg-secondary-system-background items-center justify-center rounded-full",
          className,
        )}
        style={{ width: size, height: size }}
      >
        <Text className="text-secondary-label text-xs">{name.slice(0, 2)}</Text>
      </View>
    )
  }

  return (
    <ProxiedImage
      source={{ uri: image }}
      className={cn("rounded-full", className)}
      style={{ width: size, height: size }}
      resizeMode="cover"
      proxy={{
        width: size,
        height: size,
      }}
    />
  )
}

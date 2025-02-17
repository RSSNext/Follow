import { Image, Text, View } from "react-native"

interface UserAvatarProps {
  image?: string | null
  size?: number
  name: string
}
export const UserAvatar = ({ image, size = 24, name }: UserAvatarProps) => {
  if (!image) {
    return (
      <View
        className="bg-secondary-system-background items-center justify-center rounded-full"
        style={{ width: size, height: size }}
      >
        <Text className="text-secondary-label text-xs">{name.slice(0, 2)}</Text>
      </View>
    )
  }

  return (
    <Image
      source={{ uri: image, height: size, width: size }}
      className="rounded-full"
      resizeMode="cover"
    />
  )
}

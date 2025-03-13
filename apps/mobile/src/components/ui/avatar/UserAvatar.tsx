import { cn } from "@follow/utils/src/utils"
import { Text, View } from "react-native"

import { User4CuteReIcon } from "@/src/icons/user_4_cute_re"

import { Galeria } from "../image/galeria"
import { Image } from "../image/Image"

interface UserAvatarProps {
  image?: string | null
  size?: number
  name?: string | null
  className?: string
  color?: string
  noPreview?: boolean
}

export const UserAvatar = ({
  image,
  size = 24,
  name,
  className,
  color,
  noPreview,
}: UserAvatarProps) => {
  if (!image) {
    return (
      <View
        className={cn(
          "items-center justify-center rounded-full",
          name && "bg-secondary-system-background",
          className,
        )}
        style={{ width: size, height: size }}
      >
        {name ? (
          <Text
            className="text-secondary-label p-2 text-center uppercase"
            style={{ fontSize: size }}
            adjustsFontSizeToFit
          >
            {name.slice(0, 2)}
          </Text>
        ) : (
          <User4CuteReIcon width={size} height={size} color={color} />
        )}
      </View>
    )
  }

  const ImageComponent = (
    <Image
      source={{ uri: image }}
      className={cn("rounded-full", className)}
      style={{ width: size, height: size }}
      proxy={{
        width: size,
        height: size,
      }}
    />
  )

  return noPreview ? (
    ImageComponent
  ) : (
    <Galeria urls={[image]}>
      <Galeria.Image index={0}>{ImageComponent}</Galeria.Image>
    </Galeria>
  )
}

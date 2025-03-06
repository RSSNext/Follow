import * as ImagePicker from "expo-image-picker"

export const pickImage = async (
  options?: ImagePicker.ImagePickerOptions & {
    fileName?: string
  },
) => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
    ...options,
  })

  if (result.assets?.[0]) {
    const image = result.assets[0]
    const imageResponse = await fetch(image.uri)
    const imageBlob = await imageResponse.blob()
    const formData = new FormData()
    formData.append("file", imageBlob, options?.fileName ?? image.fileName ?? "untitled.jpg")
    formData.append("type", image.mimeType ?? "image/png")

    return {
      formData,
      blob: imageBlob,
      image,
    }
  }
  return null
}

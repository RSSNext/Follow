import type { FC } from "react"
import { useEffect, useRef, useState } from "react"
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native"
import RootSiblings from "react-native-root-siblings"

import { FullWindowOverlay } from "../components/common/FullWindowOverlay"
import { RotateableLoading } from "../components/common/RotateableLoading"
import { CloseCuteReIcon } from "../icons/close_cute_re"

class LoadingStatic {
  async start<T>(promise: Promise<T>) {
    const siblings = new RootSiblings(<LoadingContainer cancel={() => siblings.destroy()} />)

    try {
      return await promise
    } finally {
      siblings.destroy()
    }
  }
}

export const loading = new LoadingStatic()

const LoadingContainer: FC<{
  cancel: () => void
}> = ({ cancel }) => {
  const cancelTimerRef = useRef<NodeJS.Timeout | null>(null)

  const [showCancelButton, setShowCancelButton] = useState(false)
  useEffect(() => {
    cancelTimerRef.current = setTimeout(() => {
      setShowCancelButton(true)
    }, 3000)
    return () => {
      if (cancelTimerRef.current) {
        clearTimeout(cancelTimerRef.current)
      }
    }
  }, [])

  return (
    <FullWindowOverlay>
      {/* Pressable to prevent the overlay from being clicked */}
      <Pressable style={StyleSheet.absoluteFillObject} className="items-center justify-center">
        <View className="relative rounded-2xl border border-white/20 bg-black/90 p-12">
          <RotateableLoading />
        </View>
        {showCancelButton && (
          <View className="absolute inset-x-0 bottom-24 flex-row justify-center">
            <TouchableOpacity onPress={cancel}>
              <View className="rounded-full border border-white/30 p-2">
                <CloseCuteReIcon color="gray" height={20} width={20} />
              </View>
            </TouchableOpacity>
          </View>
        )}
      </Pressable>
    </FullWindowOverlay>
  )
}

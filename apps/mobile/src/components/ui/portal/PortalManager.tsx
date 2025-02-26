import * as React from "react"
import { useCallback, useImperativeHandle, useMemo, useState } from "react"
import { StyleSheet, View } from "react-native"

export default React.forwardRef((_, ref: any) => {
  const [portals, setPortals] = useState<{ key: number; children: React.ReactNode }[]>([])

  const mount = useCallback((key: number, children: React.ReactNode) => {
    setPortals((oldPortals) => [...oldPortals, { key, children }])
  }, [])

  const update = useCallback((key: number, children: React.ReactNode) => {
    setPortals((oldPortals) =>
      oldPortals.map((item) => {
        if (item.key === key) {
          return { ...item, children }
        }
        return { ...item }
      }),
    )
  }, [])

  const unmount = useCallback(
    (key: number) => setPortals((oldPortals) => oldPortals.filter((item) => item.key !== key)),
    [],
  )

  useImperativeHandle(ref, () => ({
    mount,
    update,
    unmount,
  }))

  return useMemo(
    () => (
      <>
        {portals.map(({ key, children }) => (
          <View key={key} style={StyleSheet.absoluteFill} pointerEvents="box-none">
            {children}
          </View>
        ))}
      </>
    ),
    [portals],
  )
})

import { useAtomValue, useSetAtom, useStore } from "jotai"
import { useContext, useEffect } from "react"

import { ScreenItemContext } from "../ScreenItemContext"
import { ScreenNameContext } from "../ScreenNameContext"
import { useTabScreenIsFocused } from "./hooks"
import { TabScreenContext } from "./TabScreenContext"

export const ScreenNameRegister = () => {
  const nameAtom = useContext(ScreenNameContext)
  const { titleAtom } = useContext(TabScreenContext)
  const isFocused = useTabScreenIsFocused()
  const title = useAtomValue(titleAtom)
  const store = useStore()
  useEffect(() => {
    if (isFocused) {
      store.set(nameAtom, title)
    }
  }, [isFocused, title, nameAtom, store])
  return null
}

export const LifecycleEvents = ({ isSelected }: { isSelected: boolean }) => {
  const { isFocusedAtom, isAppearedAtom, isDisappearedAtom } = useContext(ScreenItemContext)
  const setIsFocused = useSetAtom(isFocusedAtom)
  const setIsAppeared = useSetAtom(isAppearedAtom)
  const setIsDisappeared = useSetAtom(isDisappearedAtom)
  useEffect(() => {
    if (isSelected) {
      setIsFocused(true)
      setIsAppeared(true)
      setIsDisappeared(false)
    } else {
      setIsFocused(false)
      setIsAppeared(false)
      setIsDisappeared(true)
    }
  }, [isSelected, setIsAppeared, setIsDisappeared, setIsFocused])
  return null
}

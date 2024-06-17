import { createContext, useContext } from "react"

interface RadioContext {
  groupId: string
  onChange: (value: string) => void

}
const RadioContext = createContext<RadioContext>(null!)

export const useRadioContext = () => useContext(RadioContext)

export const RadioGroupContextProvider = RadioContext.Provider
type RadioGroupValue = string | undefined

const RadioGroupValueContext = createContext<RadioGroupValue>("")
export const RadioGroupValueProvider = RadioGroupValueContext.Provider
export const useRadioGroupValue = () => useContext(RadioGroupValueContext)

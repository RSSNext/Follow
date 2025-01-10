import { createContext, useContext } from "react"
import type { FieldValues, UseFormReturn } from "react-hook-form"

const FormContext = createContext<UseFormReturn<any> | null>(null)

export function FormProvider<T extends FieldValues>(props: {
  form: UseFormReturn<T>
  children: React.ReactNode
}) {
  return <FormContext.Provider value={props.form}>{props.children}</FormContext.Provider>
}

export function useFormContext<T extends FieldValues>() {
  const context = useContext(FormContext)
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider")
  }
  return context as UseFormReturn<T>
}

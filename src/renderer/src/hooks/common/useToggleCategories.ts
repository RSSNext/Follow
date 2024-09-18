import { useState } from "react"

type ExpandedCategories = Record<string, boolean>

export function useToggleCategories(
  initialState: ExpandedCategories = {},
): [ExpandedCategories, (category: string) => void] {
  const [expandedCategories, setExpandedCategories] = useState<ExpandedCategories>(initialState)

  const toggleCategory = (category: string) => {
    setExpandedCategories((prevState) => ({
      ...prevState,
      [category]: !prevState[category],
    }))
  }

  return [expandedCategories, toggleCategory]
}

"use client"

import { useDark } from "@renderer/hooks/useDark"

import { Button } from "./ui/button"

export function AppearanceSwitch({ className = "" }: { className?: string }) {
  const { toggleDark } = useDark()

  return (
    <Button
      variant="ghost"
      size="sm"
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
      type="button"
      onClick={toggleDark}
      className={`flex text-xl ${className}`}
    >
      <div
        role="img"
        aria-hidden="true"
        className="i-mingcute-sun-line rotate-0 scale-100 transition-transform duration-500 dark:-rotate-90 dark:scale-0"
      />
      <div
        role="img"
        aria-hidden="true"
        className="i-mingcute-moon-line absolute rotate-90 scale-0 transition-transform duration-500 dark:rotate-0 dark:scale-100"
      />
    </Button>
  )
}

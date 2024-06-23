import type { FC } from "react"

export const SettingSectionTitle: FC<{
  title: string
}> = ({ title }) =>
  <div className="mb-2 mt-6 text-sm font-medium text-theme-disabled">{title}</div>

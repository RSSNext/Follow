import type { FC } from "react"

export const SettingSectionTitle: FC<{
  title: string
}> = ({ title }) =>
  <div className="mb-4 mt-6 text-sm font-medium capitalize text-theme-disabled">{title}</div>

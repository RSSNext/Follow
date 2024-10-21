import { useSyncThemeWebApp } from "@follow/hooks"
import { Outlet } from "react-router-dom"

export const Component = () => {
  useSyncThemeWebApp()
  return <Outlet />
}

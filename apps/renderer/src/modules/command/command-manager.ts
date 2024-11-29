import { useRegisterEntryCommands } from "./commands/entry"
import { useRegisterIntegrationCommands } from "./commands/integration"
import { useRegisterListCommands } from "./commands/list"
import { useRegisterThemeCommands } from "./commands/theme"

export function useRegisterFollowCommands() {
  useRegisterThemeCommands()
  useRegisterListCommands()
  useRegisterEntryCommands()
  useRegisterIntegrationCommands()
}

export const FollowCommandManager = () => {
  useRegisterFollowCommands()
  return null
}

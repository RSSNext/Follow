import { withResponsiveSyncComponent } from "@follow/components/utils/selector.js"

import { ProfileButton as ProfileButtonDesktop } from "./ProfileButton.desktop"
import type { ProfileButtonProps } from "./ProfileButton.electron"
import { ProfileButton as ProfileButtonMobile } from "./ProfileButton.mobile"

export const ProfileButton = withResponsiveSyncComponent<ProfileButtonProps>(
  ProfileButtonDesktop,
  ProfileButtonMobile,
)

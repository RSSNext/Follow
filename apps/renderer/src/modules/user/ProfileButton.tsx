import { withResponsiveComponent } from "@follow/components/utils/selector.js"

import type { ProfileButtonProps } from "./ProfileButton.electron"

export const ProfileButton = withResponsiveComponent<ProfileButtonProps>(
  () => import("~/modules/user/ProfileButton.desktop").then((m) => ({ default: m.ProfileButton })),
  () => import("~/modules/user/ProfileButton.mobile").then((m) => ({ default: m.ProfileButton })),
)

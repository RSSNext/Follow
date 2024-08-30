import { Avatar, AvatarImage } from "@renderer/components/ui/avatar"
import {
  LoadingCircle,
  LoadingWithIcon,
} from "@renderer/components/ui/loading"
import { getUrlIcon } from "@renderer/lib/utils"

export const EntryContentLoading = (props: { icon?: string }) => {
  if (!props.icon) {
    return (
      <LoadingWithIcon
        size="large"
        icon={<i className="i-mgc-sparkles-2-cute-re" />}
      />
    )
  }
  return (
    <div className="center flex flex-col gap-4">
      <Avatar className="animate-pulse rounded-sm">
        <AvatarImage src={getUrlIcon(props.icon).src} />
      </Avatar>
      <LoadingCircle size="medium" />
    </div>
  )
}

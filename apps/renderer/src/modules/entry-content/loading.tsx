import { Avatar, AvatarImage } from "~/components/ui/avatar"
import { LoadingCircle, LoadingWithIcon } from "~/components/ui/loading"
import { getUrlIcon } from "~/lib/utils"

export const EntryContentLoading = (props: { icon?: string }) => {
  if (!props.icon) {
    return <LoadingWithIcon size="large" icon={<i className="i-mgc-docment-cute-re" />} />
  }
  return (
    <div className="center mb-14 flex flex-col gap-4">
      <Avatar className="animate-pulse rounded-sm">
        <AvatarImage src={getUrlIcon(props.icon).src} />
      </Avatar>
      <LoadingCircle size="medium" />
    </div>
  )
}

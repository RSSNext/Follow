import { useInView } from "react-intersection-observer"

import { LoadingCircle } from "../ui/loading"

export const LoadMoreIndicator: Component<{
  onLoading: () => void
}> = ({ onLoading, children, className }) => {
  const { ref } = useInView({
    rootMargin: "1px",
    onChange(inView) {
      if (inView) onLoading()
    },
  })
  return (
    <div className={className} ref={ref}>
      {children ?? <LoadingCircle size="small" />}
    </div>
  )
}

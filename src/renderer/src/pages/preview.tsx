import { useLocation } from "react-router-dom"

export function Component() {
  const location = useLocation()
  const urlSearchParams = new URLSearchParams(location.search)
  const url = urlSearchParams.get("url")

  return (
    url && (
      <div className="h-screen w-screen">
        <img src={url} />
      </div>
    )
  )
}

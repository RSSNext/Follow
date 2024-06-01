export function Component() {
  const urlSearchParams = new URLSearchParams(location.search)
  const url = urlSearchParams.get("url")

  return url && (
    <div className="w-screen h-screen">
      <img src={url} />
    </div>
  )
}

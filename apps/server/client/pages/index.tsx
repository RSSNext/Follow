import { Link } from "react-router-dom"

export const Component = () => {
  if (!import.meta.env.DEV) {
    window.location.href = "/"
    return null
  }
  return (
    <Link to={"/share/feeds/41223694984583197"} className="text-red-500">
      To Feed
    </Link>
  )
}

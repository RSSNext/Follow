import { Link } from "react-router-dom"

export const Component = () => {
  return (
    <Link to={"/share/feeds/123"} className="text-red-500">
      Hello
    </Link>
  )
}

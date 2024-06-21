import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@renderer/components/ui/navigation-menu"
import { APP_NAME } from "@renderer/lib/constants"
import { Link } from "react-router-dom"

import { Logo } from "./icons/logo"
import { UserAvatar } from "./user-button"

const items = [
  {
    name: "Home",
    link: "/",
  },
  {
    name: "Download",
    link: "/download",
  },
  {
    name: "Blog",
    link: "/blog",
  },
]

export function Header() {
  // TODO optimize ui in mobile view
  return (
    <header className="w-full border-b px-4 py-3 lg:px-10">
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 text-xl font-bold">
            <Logo className="size-8" />
            {APP_NAME}
          </div>
          <NavigationMenu className="hidden lg:block">
            <NavigationMenuList>
              {items.map((item) => (
                <NavigationMenuItem key={item.link}>
                  <Link to={item.link}>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      {item.name}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <UserAvatar className="h-10 bg-transparent p-0 lg:px-10" />
      </div>
    </header>
  )
}

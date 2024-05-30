import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@renderer/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import { UserButton } from "./user-button";

const items = [{
  name: 'Home',
  link: '/'
}, {
  name: 'Download',
  link: '/download'
}, {
  name: 'Blog',
  link: '/blog'
}]

export function Header() {
  return (
    <header className="w-full border-b px-10 py-3">
      <div className="flex items-center justify-between w-full max-w-[1400px] mx-auto">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 text-xl font-bold">
            <img src="../icon.svg" alt="logo" className="size-8" />
            Follow
          </div>
          <NavigationMenu>
            <NavigationMenuList>
              {items.map((item) => (
                <NavigationMenuItem key={item.link}>
                  <Link to={item.link}>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      {item.name}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <UserButton className="h-10 bg-transparent px-10 py-0" />
      </div>
    </header>
  );
}

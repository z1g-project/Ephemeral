import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
const links: {
  href: string;
  text: string;
}[] = [
  { href: "/", text: "Home" },
  { href: "/settings", text: "Settings" },
  { href: "/apps", text: "Apps" },
];
export default function Navbar() {
  return (
    <div className="flex justify-between">
      <div className={`p-5 text-2xl font-bold text-slate-300`}>
        <Link to="/">Ephemeral</Link>
      </div>
      <div className="justify-end p-5">
        <NavigationMenu>
          <NavigationMenuList>
            {links.map((link) => (
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link to={link.href}>{link.text}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
}

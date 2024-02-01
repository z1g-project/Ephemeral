import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
const theme = localStorage.getItem("theme") || "";
export default function Navbar() {
  return (
    <>
      <div
        className={`absolute left-1 -translate-y-2 justify-end p-5 text-3xl font-extrabold ${
          theme === "mocha"
            ? "text-[#cdd6f4]"
            : theme === "macchiato"
              ? "text-[#cad3f5]"
              : theme === "frappe"
                ? "text-[#c6d0f5]"
                : theme === "latte"
                  ? "text-[#4c4f69]"
                  : "text-slate-300"
        }`}
      >
        Ephemeral
      </div>
      <div className="absolute right-1 -translate-y-2 justify-end p-5">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link to="/">Home</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link to="/settings">Settings</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link to="/apps">Apps</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </>
  );
}

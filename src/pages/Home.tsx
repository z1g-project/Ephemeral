import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle
} from "@components/ui/navigation-menu";
export default function Home() {
  
  const test: string = "hi";
  return (
    <>
      <h1 className="flex items-center p-1 text-blue-600">{test}</h1>
      <NavigationMenu>
        <NavigationMenuList>
        <NavigationMenuItem>
          <Link to="/settings">
            <NavigationMenuLink>Settings</NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <Input />
    </>
  );
}

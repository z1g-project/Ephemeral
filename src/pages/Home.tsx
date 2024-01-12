import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  //NavigationMenuContent,
  //NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  //NavigationMenuTrigger,
  //NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
export default function Home() {
  return (
    <>
    <div className="justify-center min-h-screen">
    <div className="flex p-5 justify-end">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link to="/">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Home
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/settings">
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Settings
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      </div>
      <div className="flex justify-center space-x-2">
        <Input className="w-80 pr-4" placeholder="Search the web freely" />
        <Button variant="default">Go</Button>
      </div>
      </div>
    </>
  );
}

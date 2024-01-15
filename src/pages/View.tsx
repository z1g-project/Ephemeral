import { Link,useParams } from "react-router-dom";
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

export default function View ()  {
  const { url } = useParams();
  function getProxy(): string {
    if (localStorage.getItem("proxy") === "ultraviolet") {
      return "dark";
    } else if (localStorage.getItem("proxy") === "ampere") {
      return "light";
    } else {
      return "dark";
    }
  }
  // Changes the URL displayed in the browser to the root (makes it harder to detect)
  window.history.pushState({},"", "/")
  return (
    <div className="flex h-screen flex-row-reverse bg-slate-950">
      <div className="absolute -translate-y-2 justify-end p-5">
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
            <NavigationMenuItem>
              <Link to="/apps">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Apps
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="h-[calc(100%_-_4rem)] w-full translate-y-16">
        <iframe
          src={`/~/${getProxy()}/${url}`}
          className="h-full w-full border-none"
        />
      </div>
    </div>
  );
}

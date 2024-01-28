import { useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
export default function CloakSettings() {
  const cloakTitleInputRef = useRef<HTMLInputElement>(null);
  const cloakFaviconInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  return (
    <>
      <Card className="h-96 w-96">
        <CardHeader>
          <CardTitle>Cloak</CardTitle>
          <CardDescription>Set cloaking settings</CardDescription>
        </CardHeader>
        <CardContent className={``}>
          <Label htmlFor="presets">Presets</Label>
          <Select
            onValueChange={(value) => {
              localStorage.setItem("cloakPreset", value);
              if (value == "Schoology") {
                localStorage.setItem("cloakTitle", "Home | Schoology");
                localStorage.setItem(
                  "cloakFavicon",
                  "https://asset-cdn.schoology.com/sites/all/themes/schoology_theme/favicon.ico",
                );
              } else if (value == "Google Classroom") {
                localStorage.setItem("cloakTitle", "Classes");
                localStorage.setItem(
                  "cloakFavicon",
                  "https://ssl.gstatic.com/classroom/ic_product_classroom_144.png",
                );
              } else if (value == "Canvas") {
                localStorage.setItem("cloakTitle", "Dashboard");
                localStorage.setItem(
                  "cloakFavicon",
                  "https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico",
                );
              } else if (value == "Google") {
                localStorage.setItem("cloakTitle", "Google");
                localStorage.setItem(
                  "cloakFavicon",
                  "https://www.google.com/favicon.ico",
                );
              }
              toast({
                title: "Cloak Preset Changed",
                description: "Cloak preset has been changed to " + value,
              });
              window.location.reload();
            }}
          >
            <SelectTrigger aria-label="Presets">
              <SelectValue
                placeholder={
                  localStorage.getItem("cloakPreset")
                    ? localStorage.getItem("cloakPreset")
                    : "Select a preset"
                }
              />
              <SelectContent position="popper">
                <SelectItem value="Schoology">Schoology</SelectItem>
                <SelectItem value="Google Classroom">
                  Google Classroom
                </SelectItem>
                <SelectItem value="Canvas">Canvas</SelectItem>
                <SelectItem value="Google">Google</SelectItem>
              </SelectContent>
            </SelectTrigger>
          </Select>
          <Label htmlFor="title">Page Title</Label>
          <Input
            id="page-title"
            ref={cloakTitleInputRef}
            type="text"
            placeholder="Set how the tab title looks"
            defaultValue={localStorage.getItem("cloakTitle") || ""}
          />
          <Label htmlFor="title">Page Favicon</Label>
          <Input
            id="page-favicon"
            ref={cloakFaviconInputRef}
            type="text"
            placeholder="Set the favicon"
            defaultValue={localStorage.getItem("cloakFavicon") || ""}
          />
        </CardContent>
        <CardFooter className="justify-between space-x-2">
          <Button
            variant="default"
            onClick={() => {
              if (cloakTitleInputRef.current!.value && cloakFaviconInputRef.current!.value) {
                localStorage.setItem("cloakPreset", "Custom");
              }
              localStorage.setItem(
                "cloakTitle",
                cloakTitleInputRef.current!.value,
              );
              localStorage.setItem(
                "cloakFavicon",
                cloakFaviconInputRef.current!.value,
              );
              toast({
                title: "Cloak Preset Changed",
                description: `Cloak preset has been changed to "${
                  cloakTitleInputRef.current!.value
                }"`,
              });
              window.location.reload();
            }}
          >
            Save
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              localStorage.removeItem("cloakPreset");
              localStorage.removeItem("cloakTitle");
              localStorage.removeItem("cloakFavicon");
              toast({
                title: "Cloak Preset Removed",
                description: "Cloak preset has been removed",
                variant: "destructive",
              });
              window.location.reload();
            }}
          >
            Reset
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              const newWindow = window.open("about:blank");
              const iframe = document.createElement("iframe");
              iframe.src = window.location.origin;
              iframe.style.width = "100%";
              iframe.style.height = "100%";
              iframe.style.border = "none";
              iframe.style.overflow = "hidden";
              iframe.style.margin = "0";
              iframe.style.padding = "0";
              iframe.style.position = "fixed";
              iframe.style.top = "0";
              iframe.style.bottom = "0";
              iframe.style.left = "0";
              iframe.style.right = "0";
              newWindow?.document.body.appendChild(iframe);
              window.location.replace("https://google.com");
            }}
          >
            Open about:blank
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}

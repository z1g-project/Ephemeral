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
  return (
    <>
      <Card className="h-96 w-96">
        <CardHeader>
          <CardTitle>Cloak</CardTitle>
          <CardDescription>Set cloaking settings</CardDescription>
        </CardHeader>
        <CardContent className="bg-slate-950">
          <Label htmlFor="presets">Presets</Label>
          <Select>
            <SelectTrigger className="bg-slate-950">
              <SelectValue placeholder="Select a preset" />
              <SelectContent position="popper" className="bg-slate-950">
                <SelectItem value="schoology">Schoology</SelectItem>
                <SelectItem value="gclassroom">Google Classroom</SelectItem>
                <SelectItem value="canvas">Canvas</SelectItem>
              </SelectContent>
            </SelectTrigger>
          </Select>
          <Label htmlFor="title">Page Title</Label>
          <Input
            id="page-title"
            type="text"
            placeholder="Set how the tab title looks"
            className="bg-slate-950"
          />
          <Label htmlFor="title">Page Favicon</Label>
          <Input
            id="page-favicon"
            type="text"
            placeholder="Set the favicon"
            className="bg-slate-950"
          />
        </CardContent>
        <CardFooter className="justify-between">
          <Button variant="default">Save</Button>
          <Button
            variant="secondary"
            onClick={() => {
              let newWindow = window.open("about:blank");
              let iframe = document.createElement("iframe");
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
            Open in about:blank
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}

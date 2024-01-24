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
        <CardFooter>
          <Button variant="default">Save</Button>
        </CardFooter>
      </Card>
    </>
  );
}

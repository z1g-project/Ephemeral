import Navbar from "@/components/Navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function Settings() {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <Navbar />
      <div className="absolute left-1/2 top-5 -translate-x-1/2 font-['Inter'] text-3xl font-extrabold text-slate-400">
        Settings
      </div>
      <div className="h-72 w-96 p-6"></div>
      <Card className="absolute w-[500px] bg-slate-950 left-20 top-20">
        <CardHeader>
          <CardTitle>Accessibility</CardTitle>
          <CardDescription>placeholder</CardDescription>
        </CardHeader>
        <CardContent className="bg-slate-950">
          <Label htmlFor="name">Search Engine</Label>
          <Select>
            <SelectTrigger id="search" className="bg-slate-950">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent position="popper" className="bg-slate-950 text-white">
              <SelectItem value="google">Google</SelectItem>
              <SelectItem value="yahoo">Yahoo</SelectItem>
              <SelectItem value="bing">Bing</SelectItem>
              <SelectItem value="duckduckgo">DuckDuckGo</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="destructive">Reset Changes</Button>
          <Button variant="default">Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

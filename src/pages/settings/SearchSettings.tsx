import { useRef } from "react";
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
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
export default function SearchSettings() {
  const { toast } = useToast();
  const customSearchRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <Card className="h-96 w-96">
        <CardHeader>
          <CardTitle>Search</CardTitle>
          <CardDescription>Set search engine</CardDescription>
        </CardHeader>
        <CardContent>
          <Label htmlFor="name" className="text-sm font-medium">
            Presets
          </Label>
          <Select
            onValueChange={(value) => {
              if (value === "Google") {
                localStorage.setItem("search", "Google");
                localStorage.setItem(
                  "searchUrl",
                  "https://google.com/search?q=",
                );
              } else if (value === "DuckDuckGo") {
                localStorage.setItem("search", "DuckDuckGo");
                localStorage.setItem("searchUrl", "https://duckduckgo.com/?q=");
              } else if (value === "Bing") {
                localStorage.setItem("search", "Bing");
                localStorage.setItem("searchUrl", "https://bing.com/search?q=");
              }
              toast({
                title: "Search Engine Changed",
                description: "Search Engine has been changed to " + value,
              });
            }}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  localStorage.getItem("search") || "Select a search engine"
                }
              />
            </SelectTrigger>
            <SelectContent position="popper" className=" text-white">
              <SelectItem value="Google">Google</SelectItem>
              <SelectItem value="DuckDuckGo">DuckDuckGo</SelectItem>
              <SelectItem value="Bing">Bing</SelectItem>
            </SelectContent>
          </Select>
          <Label htmlFor="name" className="text-sm font-medium">
            Search Engine URL
          </Label>
          <Input
            id="name"
            ref={customSearchRef}
            placeholder="Enter a valid Search Engine URL"
          />
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => {
              localStorage.setItem("search", "Custom");
              if (customSearchRef.current!.value === "") {
                localStorage.setItem(
                  "searchUrl",
                  "https://google.com/search?q=",
                );
                localStorage.setItem("search", "Google");
              }
              localStorage.setItem("searchUrl", customSearchRef.current!.value);
              toast({
                title: "Search Engine Changed",
                description:
                  "Search Engine has been changed to " +
                  customSearchRef.current!.value,
              });
            }}
          >
            Save
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}

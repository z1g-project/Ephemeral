import Navbar from "@/components/Navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
export default function Settings() {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <Navbar />
      <div className="absolute left-1/2 -translate-x-1/2 font-['Inter'] text-3xl font-extrabold text-slate-400">
        Settings
      </div>
      <div className="h-72 w-96 p-6"></div>
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    </div>
  );
}

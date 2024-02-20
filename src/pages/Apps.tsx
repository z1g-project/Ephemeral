import Navbar from "@/components/Navbar";
import Header from "@/components/Header";
/*
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
*/
export default function Apps() {
  return (
    <>
      <Header title="Apps | Ephemeral" />
      <div>
        <Navbar />
        <div className="absolute left-1/2 top-2 -translate-x-1/2 translate-y-5 text-3xl font-bold text-slate-300">
          Apps
        </div>
        <div className="w-full h-[calc(100%_-_5rem)] translate-y-20">
          <iframe
            width="100%"
            height="100%"
            src="https://example.com"
          ></iframe>
        {/*
        {apps.map((app) => (
          <div>
            <Card>
              <CardHeader>
                <CardTitle></CardTitle>
                <CardDescription></CardDescription>
              </CardHeader>
            </Card>
          </div>
        ))}
        */}
        </div>
      </div>
    </>
  );
}
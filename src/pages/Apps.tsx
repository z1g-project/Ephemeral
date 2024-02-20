import Navbar from "@/components/Navbar";
import Header from "@/components/Header";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import { apps } from "./apps/apps";

export function open() {
  
}

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
        {apps.map((app) => (
          <div>
            <a href={`../../apps/${app.path}`}>
              <Card>
                <CardHeader>
                  <CardTitle>{app.name}</CardTitle>
                  <CardDescription>{app.desc}</CardDescription>
                </CardHeader>
                  <CardContent>
                    <img src={`../../apps/${app.path}/icon.png`}></img>
                  </CardContent>
                </Card>
              </a>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
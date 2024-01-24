import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
export default function PageNotFound() {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <Navbar />
      <div className="absolute left-1/2 top-[calc(50%_-_5rem)] -translate-x-1/2 -translate-y-1/2 font-['Inter'] text-6xl font-extrabold text-slate-200">
        404
      </div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-['Inter'] text-3xl font-extrabold text-slate-400">
        Page Not Found
      </div>

      <Button
        asChild
        type="button"
        variant="link"
        className="absolute left-1/2 top-[calc(50%_+_5rem)] -translate-x-1/2 -translate-y-1/2 font-['Inter'] text-slate-200"
      >
        <Link to="/">Go Home</Link>
      </Button>
    </div>
  );
}

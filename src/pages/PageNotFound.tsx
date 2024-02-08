import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
export default function PageNotFound() {
  return (
    <>
      <Header title="404 | Ephemeral" />
      <div className="flex min-h-screen">
        <Navbar />
        <div className="absolute left-1/2 top-[calc(50%_-_5rem)] -translate-x-1/2 -translate-y-1/2 text-6xl font-extrabold text-accent-foreground">
          404
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-extrabold text-muted-foreground">
          Page Not Found
        </div>

        <Button
          asChild
          type="button"
          variant="link"
          className="absolute left-1/2 top-[calc(50%_+_5rem)] -translate-x-1/2 -translate-y-1/2 text-foreground "
        >
          <Link to="/">Go Home</Link>
        </Button>
      </div>
    </>
  );
}

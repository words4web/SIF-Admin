"use client";

import Link from "next/link";
import { MoveLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center animate-fade-in">
      <div className="relative flex flex-col items-center">
        <h1 className="font-serif text-8xl sm:text-9xl font-extrabold tracking-tighter text-primary/10 select-none">
          404
        </h1>
        <div className="absolute top-[45%] flex flex-col items-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-foreground">
            Page Not Found
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm sm:max-w-md">
            The admin console page you are looking for might have been removed,
            had its name changed, or is temporarily unavailable.
          </p>
        </div>
      </div>

      <div className="mt-24">
        <Button
          asChild
          size="lg"
          className="rounded-xl shadow-lg shadow-primary/20">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-semibold">
            <MoveLeft className="h-4 w-4" /> Return to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}

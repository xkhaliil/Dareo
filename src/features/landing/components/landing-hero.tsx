import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";

export default function LandingHero() {
  return (
    <main className="relative z-10 flex flex-1 items-center justify-center px-6">
      <div className="mx-auto max-w-2xl py-20 text-center">
        <div className="animate-fade-in">
          <Badge
            variant="secondary"
            className="mb-8 gap-1.5 px-3 py-1.5 text-xs"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Season 1 — Now Live
          </Badge>
        </div>

        <h1 className="animate-fade-in-delay-1 mb-6 text-5xl leading-[1.05] font-black tracking-tight sm:text-6xl md:text-7xl">
          Dare your
          <br />
          <span className="text-primary">friends</span> 🎲
        </h1>

        <p className="text-muted-foreground animate-fade-in-delay-2 mx-auto mb-10 max-w-lg text-lg leading-relaxed md:text-xl">
          Challenge your crew, complete dares, earn XP and climb the
          leaderboard.
        </p>

        <div className="animate-fade-in-delay-3 flex justify-center gap-3">
          <Link to="/sign-up">
            <Button size="lg" className="cursor-pointer gap-2 px-8 text-base">
              Start Playing
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

import "./App.css";

import { useAuth } from "@/context/auth-context";
import { ArrowRight, Dice5, Trophy, Users, Zap } from "lucide-react";
import { Link, Navigate } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/navbar";

function App() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/game" replace />;
  }

  return (
    <div className="bg-background flex min-h-screen flex-col">
      {/* ===== BACKGROUND EFFECTS ===== */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="animate-pulse-glow absolute top-[-40%] left-1/2 h-150 w-150 -translate-x-1/2 rounded-full bg-purple-500/10 blur-[120px]" />
        <div
          className="animate-pulse-glow absolute right-[-10%] bottom-[-30%] h-100 w-100 rounded-full bg-indigo-500/8 blur-[100px]"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* ===== NAVBAR ===== */}
      <Navbar />

      {/* ===== HERO ===== */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-6">
        <div className="mx-auto max-w-2xl py-20 text-center">
          {/* Badge */}
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

          {/* Title */}
          <h1 className="animate-fade-in-delay-1 mb-6 text-5xl leading-[1.05] font-black tracking-tight sm:text-6xl md:text-7xl">
            Dare your
            <br />
            <span className="text-primary">friends</span> 🎲
          </h1>

          {/* Subtitle */}
          <p className="text-muted-foreground animate-fade-in-delay-2 mx-auto mb-10 max-w-lg text-lg leading-relaxed md:text-xl">
            Challenge your crew, complete dares, earn XP and climb the
            leaderboard.
          </p>

          {/* CTA */}
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

      {/* ===== FLOATING GAME CARDS ===== */}
      <div className="relative z-10 px-6 pb-24">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card className="bg-card/50 border-border/50 animate-float backdrop-blur-sm">
              <CardContent className="flex items-start gap-4 p-5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10">
                  <Users className="size-5 text-purple-400" />
                </div>
                <div>
                  <p className="mb-1 text-sm font-semibold">Private Groups</p>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Create squads & invite friends
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50 animate-float-delayed backdrop-blur-sm">
              <CardContent className="flex items-start gap-4 p-5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-pink-500/10">
                  <Zap className="size-5 text-pink-400" />
                </div>
                <div>
                  <p className="mb-1 text-sm font-semibold">Earn XP</p>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Level up & unlock new ranks
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50 animate-float backdrop-blur-sm">
              <CardContent className="flex items-start gap-4 p-5">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10">
                  <Trophy className="size-5 text-indigo-400" />
                </div>
                <div>
                  <p className="mb-1 text-sm font-semibold">Leaderboard</p>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Compete for the top spot
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <footer className="border-border/50 relative z-10 border-t px-6 py-6">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <Dice5 className="size-3.5" />
            <span>© 2026 Dareo</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

import "./App.css";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Trophy, Zap, ArrowRight, Dice5 } from "lucide-react";

function App() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* ===== BACKGROUND EFFECTS ===== */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-40%] left-1/2 -translate-x-1/2 w-150 h-150 rounded-full bg-purple-500/10 blur-[120px] animate-pulse-glow" />
        <div
          className="absolute bottom-[-30%] right-[-10%] w-100 h-100 rounded-full bg-indigo-500/8 blur-[100px] animate-pulse-glow"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* ===== NAVBAR ===== */}
      <nav className="relative z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dice5 className="size-5 text-primary" />
            <span className="text-lg font-bold tracking-tight">Dareo</span>
          </div>
          <Button size="sm" className="cursor-pointer">
            Launch App
          </Button>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl mx-auto text-center py-20">
          {/* Badge */}
          <div className="animate-fade-in">
            <Badge
              variant="secondary"
              className="mb-8 gap-1.5 px-3 py-1.5 text-xs"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Season 1 — Now Live
            </Badge>
          </div>

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6 animate-fade-in-delay-1">
            Dare your
            <br />
            <span className="text-primary">friends</span> 🎲
          </h1>

          {/* Subtitle */}
          <p className="text-muted-foreground text-lg md:text-xl max-w-lg mx-auto mb-10 leading-relaxed animate-fade-in-delay-2">
            Challenge your crew, complete dares, earn XP and climb the
            leaderboard.
          </p>

          {/* CTA */}
          <div className="flex gap-3 justify-center animate-fade-in-delay-3">
            <Button size="lg" className="gap-2 text-base px-8 cursor-pointer">
              Start Playing
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </main>

      {/* ===== FLOATING GAME CARDS ===== */}
      <div className="relative z-10 pb-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-card/50 border-border/50 backdrop-blur-sm animate-float">
              <CardContent className="flex items-start gap-4 p-5">
                <div className="shrink-0 size-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Users className="size-5 text-purple-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1">Private Groups</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Create squads & invite friends
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50 backdrop-blur-sm animate-float-delayed">
              <CardContent className="flex items-start gap-4 p-5">
                <div className="shrink-0 size-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
                  <Zap className="size-5 text-pink-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1">Earn XP</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Level up & unlock new ranks
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50 backdrop-blur-sm animate-float">
              <CardContent className="flex items-start gap-4 p-5">
                <div className="shrink-0 size-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                  <Trophy className="size-5 text-indigo-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1">Leaderboard</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Compete for the top spot
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <footer className="relative z-10 border-t border-border/50 py-6 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground text-xs">
            <Dice5 className="size-3.5" />
            <span>© 2026 Dareo</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

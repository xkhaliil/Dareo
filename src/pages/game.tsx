import { useAuth } from "@/context/auth-context";
import Navbar from "@/components/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Trophy, Zap, Plus, Dice5 } from "lucide-react";

export default function GamePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-40%] left-1/2 -translate-x-1/2 w-150 h-150 rounded-full bg-purple-500/10 blur-[120px] animate-pulse-glow" />
        <div
          className="absolute bottom-[-30%] right-[-10%] w-100 h-100 rounded-full bg-indigo-500/8 blur-[100px] animate-pulse-glow"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <Navbar />

      <main className="relative z-10 flex-1 px-6 py-10">
        <div className="max-w-5xl mx-auto">
          {/* Welcome */}
          <div className="mb-10 animate-fade-in">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Welcome back,{" "}
              <span className="text-primary">{user?.username}</span> 🎲
            </h1>
            <p className="text-muted-foreground">
              Ready to take on some dares today?
            </p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 animate-fade-in-delay-1">
            <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="size-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Zap className="size-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{user?.xp ?? 0}</p>
                  <p className="text-xs text-muted-foreground">Total XP</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="size-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                  <Trophy className="size-5 text-indigo-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">Level {user?.level ?? 1}</p>
                  <p className="text-xs text-muted-foreground">{user?.rank ?? "ROOKIE"}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="size-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
                  <Users className="size-5 text-pink-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-xs text-muted-foreground">Groups</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in-delay-2">
            <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Dice5 className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Active Dares</p>
                    <p className="text-xs text-muted-foreground">
                      No active dares yet
                    </p>
                  </div>
                </div>
                <Button className="w-full gap-2 cursor-pointer" variant="outline">
                  <Plus className="size-4" />
                  Create a Dare
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Your Groups</p>
                    <p className="text-xs text-muted-foreground">
                      No groups joined yet
                    </p>
                  </div>
                </div>
                <Button className="w-full gap-2 cursor-pointer" variant="outline">
                  <Plus className="size-4" />
                  Create a Group
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
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

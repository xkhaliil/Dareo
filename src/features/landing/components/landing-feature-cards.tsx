import { Trophy, Users, Zap } from "lucide-react";

import { Card, CardContent } from "@/shared/components/ui/card";

export default function LandingFeatureCards() {
  return (
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
  );
}

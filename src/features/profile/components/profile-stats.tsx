import { Trophy, Zap } from "lucide-react";

import type { AuthUser } from "@/shared/stores/auth-store";
import { Card, CardContent } from "@/shared/components/ui/card";

interface ProfileStatsProps {
  user: AuthUser;
}

export default function ProfileStats({ user }: ProfileStatsProps) {
  return (
    <div className="animate-fade-in-delay-1 mb-6 grid grid-cols-2 gap-4">
      <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex size-10 items-center justify-center rounded-lg bg-purple-500/10">
            <Zap className="size-5 text-purple-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">{user.xp}</p>
            <p className="text-muted-foreground text-xs">Total XP</p>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex size-10 items-center justify-center rounded-lg bg-indigo-500/10">
            <Trophy className="size-5 text-indigo-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">Level {user.level}</p>
            <p className="text-muted-foreground text-xs">{user.rank}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

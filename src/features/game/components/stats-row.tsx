import { Card, CardContent } from "@/shared/components/ui/card";
import type { AuthUser } from "@/stores/auth-store";
import { Trophy, Users, Zap } from "lucide-react";

interface StatsRowProps {
  user: AuthUser;
  groupCount: number;
}

export default function StatsRow({ user, groupCount }: StatsRowProps) {
  return (
    <div className="animate-fade-in-delay-1 mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
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
      <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex size-10 items-center justify-center rounded-lg bg-pink-500/10">
            <Users className="size-5 text-pink-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">{groupCount}</p>
            <p className="text-muted-foreground text-xs">Groups</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

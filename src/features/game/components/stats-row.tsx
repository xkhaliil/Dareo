import { Card, CardContent } from "@/shared/components/ui/card";
import { Zap, Trophy, Users } from "lucide-react";
import type { AuthUser } from "@/stores/auth-store";

interface StatsRowProps {
  user: AuthUser;
  groupCount: number;
}

export default function StatsRow({ user, groupCount }: StatsRowProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 animate-fade-in-delay-1">
      <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="size-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <Zap className="size-5 text-purple-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">{user.xp}</p>
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
            <p className="text-2xl font-bold">Level {user.level}</p>
            <p className="text-xs text-muted-foreground">{user.rank}</p>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="size-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
            <Users className="size-5 text-pink-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">{groupCount}</p>
            <p className="text-xs text-muted-foreground">Groups</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

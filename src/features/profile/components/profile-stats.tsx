import { Card, CardContent } from "@/shared/components/ui/card";
import { Zap, Trophy } from "lucide-react";
import type { AuthUser } from "@/stores/auth-store";

interface ProfileStatsProps {
  user: AuthUser;
}

export default function ProfileStats({ user }: ProfileStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6 animate-fade-in-delay-1">
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
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { Users } from "lucide-react";
import { RANK_COLORS, ROLE_ICONS } from "../constants";
import type { GroupMember } from "@/services/group-api";

interface MemberListProps {
  members: GroupMember[];
}

export default function MemberList({ members }: MemberListProps) {
  return (
    <Card className="bg-card/50 border-border/50 backdrop-blur-sm mb-6 animate-fade-in-delay-1">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="size-5" /> Members
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {members.map((member, i) => {
          const RoleIcon = ROLE_ICONS[member.role];
          return (
            <div key={member.id}>
              {i > 0 && <Separator className="mb-3" />}
              <div className="flex items-center gap-3">
                <Avatar className="size-10">
                  {member.user.avatarUrl && (
                    <AvatarImage src={member.user.avatarUrl} alt={member.user.username} />
                  )}
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                    {member.user.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{member.user.username}</p>
                    {RoleIcon && <RoleIcon className="size-3.5 text-yellow-500 shrink-0" />}
                  </div>
                  <p className={`text-xs ${RANK_COLORS[member.user.rank] ?? "text-muted-foreground"}`}>
                    {member.user.rank} · Level {member.user.level}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs capitalize">
                  {member.role.toLowerCase()}
                </Badge>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

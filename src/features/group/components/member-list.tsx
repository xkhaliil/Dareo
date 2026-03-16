import type { GroupMember } from "@/services/group-api";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";
import { Users } from "lucide-react";

import { RANK_COLORS, ROLE_ICONS } from "../constants";

interface MemberListProps {
  members: GroupMember[];
}

export default function MemberList({ members }: MemberListProps) {
  return (
    <Card className="bg-card/50 border-border/50 animate-fade-in-delay-1 mb-6 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
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
                    <AvatarImage
                      src={member.user.avatarUrl}
                      alt={member.user.username}
                    />
                  )}
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                    {member.user.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium">
                      {member.user.username}
                    </p>
                    {RoleIcon && (
                      <RoleIcon className="size-3.5 shrink-0 text-yellow-500" />
                    )}
                  </div>
                  <p
                    className={`text-xs ${RANK_COLORS[member.user.rank] ?? "text-muted-foreground"}`}
                  >
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

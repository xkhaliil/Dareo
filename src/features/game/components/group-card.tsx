import { useState } from "react";

import type { GroupPreview } from "@/services/group-api";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Check, Copy, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface GroupCardProps {
  group: GroupPreview;
}

export default function GroupCard({ group }: GroupCardProps) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  function copyCode(e: React.MouseEvent) {
    e.stopPropagation();
    navigator.clipboard.writeText(group.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card
      className="bg-card/50 border-border/50 hover:border-primary/30 cursor-pointer backdrop-blur-sm transition-colors"
      onClick={() => navigate(`/group/${group.id}`)}
    >
      <CardContent className="flex items-center gap-4 p-5">
        <div className="bg-primary/10 flex size-12 shrink-0 items-center justify-center rounded-xl">
          <Users className="text-primary size-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{group.name}</p>
          <p className="text-muted-foreground text-xs">
            {group.members.length} member{group.members.length !== 1 && "s"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {group.members.slice(0, 4).map((m) => (
              <Avatar
                key={m.user.id}
                className="border-background size-7 border-2"
              >
                <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                  {m.user.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
            {group.members.length > 4 && (
              <div className="bg-muted border-background text-muted-foreground flex size-7 items-center justify-center rounded-full border-2 text-[10px] font-medium">
                +{group.members.length - 4}
              </div>
            )}
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="text-muted-foreground cursor-pointer gap-1 text-xs"
            onClick={copyCode}
          >
            {copied ? (
              <>
                <Check className="size-3" /> Copied
              </>
            ) : (
              <>
                <Copy className="size-3" /> {group.code}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

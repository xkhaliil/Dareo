import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { Users, Copy, Check } from "lucide-react";
import { useState } from "react";
import type { GroupPreview } from "@/services/group-api";

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
      className="bg-card/50 border-border/50 backdrop-blur-sm hover:border-primary/30 transition-colors cursor-pointer"
      onClick={() => navigate(`/group/${group.id}`)}
    >
      <CardContent className="flex items-center gap-4 p-5">
        <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Users className="size-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">{group.name}</p>
          <p className="text-xs text-muted-foreground">
            {group.members.length} member{group.members.length !== 1 && "s"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {group.members.slice(0, 4).map((m) => (
              <Avatar key={m.user.id} className="size-7 border-2 border-background">
                <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                  {m.user.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}
            {group.members.length > 4 && (
              <div className="size-7 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[10px] font-medium text-muted-foreground">
                +{group.members.length - 4}
              </div>
            )}
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="gap-1 text-xs text-muted-foreground cursor-pointer"
            onClick={copyCode}
          >
            {copied ? <><Check className="size-3" /> Copied</> : <><Copy className="size-3" /> {group.code}</>}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

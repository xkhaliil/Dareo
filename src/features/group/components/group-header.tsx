import { useState } from "react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Users, Copy, Check } from "lucide-react";
import type { GroupData } from "@/services/group-api";

interface GroupHeaderProps {
  group: GroupData;
}

export default function GroupHeader({ group }: GroupHeaderProps) {
  const [copied, setCopied] = useState(false);

  function copyCode() {
    navigator.clipboard.writeText(group.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card className="bg-card/50 border-border/50 backdrop-blur-sm mb-6 animate-fade-in">
      <CardContent className="p-8">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Users className="size-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-1">{group.name}</h1>
            <p className="text-sm text-muted-foreground">
              {group.members.length} member{group.members.length !== 1 && "s"}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 cursor-pointer font-mono tracking-widest"
            onClick={copyCode}
          >
            {copied ? (
              <><Check className="size-3.5" /> Copied!</>
            ) : (
              <><Copy className="size-3.5" /> {group.code}</>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

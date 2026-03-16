import { useState } from "react";

import type { GroupData } from "@/services/group-api";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Check, Copy, Users } from "lucide-react";

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
    <Card className="bg-card/50 border-border/50 animate-fade-in mb-6 backdrop-blur-sm">
      <CardContent className="p-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="bg-primary/10 flex size-16 items-center justify-center rounded-2xl">
            <Users className="text-primary size-8" />
          </div>
          <div>
            <h1 className="mb-1 text-2xl font-bold tracking-tight">
              {group.name}
            </h1>
            <p className="text-muted-foreground text-sm">
              {group.members.length} member{group.members.length !== 1 && "s"}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer gap-2 font-mono tracking-widest"
            onClick={copyCode}
          >
            {copied ? (
              <>
                <Check className="size-3.5" /> Copied!
              </>
            ) : (
              <>
                <Copy className="size-3.5" /> {group.code}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

import { Users } from "lucide-react";

import { Card, CardContent } from "@/shared/components/ui/card";

export default function GroupListEmpty() {
  return (
    <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
      <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
        <Users className="text-muted-foreground/40 size-10" />
        <p className="text-muted-foreground">
          No groups yet. Create one or join with a code!
        </p>
      </CardContent>
    </Card>
  );
}

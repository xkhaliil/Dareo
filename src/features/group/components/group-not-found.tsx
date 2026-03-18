import { ArrowLeft, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Navbar from "@/shared/components/navbar";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";

interface GroupNotFoundProps {
  message?: string;
}

export default function GroupNotFound({ message }: GroupNotFoundProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center">
        <Card className="bg-card/50 border-border/50 mx-6 w-full max-w-md backdrop-blur-sm">
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <Users className="text-muted-foreground/40 size-10" />
            <p className="text-muted-foreground">
              {message ?? "Group not found"}
            </p>
            <Button
              variant="outline"
              className="cursor-pointer gap-2"
              onClick={() => navigate("/game")}
            >
              <ArrowLeft className="size-4" /> Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

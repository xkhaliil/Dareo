import { useAuth } from "@/context/auth-context";
import Navbar from "@/shared/components/navbar";
import PageBackground from "@/shared/components/page-background";
import PageFooter from "@/shared/components/page-footer";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Loader2, Users } from "lucide-react";

import { useGroups } from "@/hooks/use-group-service";

import CreateGroupDialog from "./components/create-group-dialog";
import GroupCard from "./components/group-card";
import JoinGroupDialog from "./components/join-group-dialog";
import StatsRow from "./components/stats-row";

export default function GamePage() {
  const { user } = useAuth();
  const { data: groups = [], isLoading } = useGroups();

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <PageBackground />
      <Navbar />
      <main className="relative z-10 flex-1 px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="animate-fade-in mb-10">
            <h1 className="mb-2 text-3xl font-bold tracking-tight">
              Welcome back,{" "}
              <span className="text-primary">{user?.username}</span> 🎲
            </h1>
            <p className="text-muted-foreground">
              Ready to take on some dares today?
            </p>
          </div>

          {user && <StatsRow user={user} groupCount={groups.length} />}

          <div className="animate-fade-in-delay-2 mb-6 flex gap-3">
            <CreateGroupDialog />
            <JoinGroupDialog />
          </div>

          <div className="animate-fade-in-delay-2 grid gap-4">
            <h2 className="text-lg font-semibold">Your Groups</h2>
            {isLoading ? (
              <div className="text-muted-foreground flex items-center justify-center py-12">
                <Loader2 className="mr-2 size-5 animate-spin" /> Loading…
              </div>
            ) : groups.length === 0 ? (
              <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                  <Users className="text-muted-foreground/40 size-10" />
                  <p className="text-muted-foreground">
                    No groups yet. Create one or join with a code!
                  </p>
                </CardContent>
              </Card>
            ) : (
              groups.map((group) => <GroupCard key={group.id} group={group} />)
            )}
          </div>
        </div>
      </main>
      <PageFooter />
    </div>
  );
}

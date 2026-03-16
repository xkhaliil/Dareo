import { useAuth } from "@/context/auth-context";
import Navbar from "@/shared/components/navbar";
import PageBackground from "@/shared/components/page-background";
import PageFooter from "@/shared/components/page-footer";
import StatsRow from "./components/stats-row";
import GroupCard from "./components/group-card";
import CreateGroupDialog from "./components/create-group-dialog";
import JoinGroupDialog from "./components/join-group-dialog";
import { useGroups } from "@/hooks/use-group-service";
import { Users, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";

export default function GamePage() {
  const { user } = useAuth();
  const { data: groups = [], isLoading } = useGroups();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PageBackground />
      <Navbar />
      <main className="relative z-10 flex-1 px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10 animate-fade-in">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Welcome back, <span className="text-primary">{user?.username}</span> 🎲
            </h1>
            <p className="text-muted-foreground">Ready to take on some dares today?</p>
          </div>

          {user && <StatsRow user={user} groupCount={groups.length} />}

          <div className="flex gap-3 mb-6 animate-fade-in-delay-2">
            <CreateGroupDialog />
            <JoinGroupDialog />
          </div>

          <div className="grid gap-4 animate-fade-in-delay-2">
            <h2 className="text-lg font-semibold">Your Groups</h2>
            {isLoading ? (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                <Loader2 className="size-5 animate-spin mr-2" /> Loading…
              </div>
            ) : groups.length === 0 ? (
              <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                  <Users className="size-10 text-muted-foreground/40" />
                  <p className="text-muted-foreground">No groups yet. Create one or join with a code!</p>
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

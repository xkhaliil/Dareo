import { useAuth } from "@/shared/context/auth-context";
import { useGroups } from "@/shared/hooks/use-group-service";
import Navbar from "@/shared/components/navbar";
import PageBackground from "@/shared/components/page-background";
import PageFooter from "@/shared/components/page-footer";

import CreateGroupDialog from "./components/create-group-dialog";
import GameWelcome from "./components/game-welcome";
import GroupCard from "./components/group-card";
import GroupListEmpty from "./components/group-list-empty";
import GroupListLoading from "./components/group-list-loading";
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
          {user && <GameWelcome username={user.username} />}
          {user && <StatsRow user={user} groupCount={groups.length} />}

          <div className="animate-fade-in-delay-2 mb-6 flex gap-3">
            <CreateGroupDialog />
            <JoinGroupDialog />
          </div>

          <div className="animate-fade-in-delay-2 grid gap-4">
            <h2 className="text-lg font-semibold">Your Groups</h2>
            {isLoading ? (
              <GroupListLoading />
            ) : groups.length === 0 ? (
              <GroupListEmpty />
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

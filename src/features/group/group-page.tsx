import Navbar from "@/shared/components/navbar";
import PageBackground from "@/shared/components/page-background";
import PageFooter from "@/shared/components/page-footer";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { ArrowLeft, Loader2, Users } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { useGroup } from "@/hooks/use-group-service";

import DareList from "./components/dare-list";
import DareStatusDialog from "./components/dare-status-dialog";
import DeleteDareDialog from "./components/delete-dare-dialog";
import EditDareDrawer from "./components/edit-dare-drawer";
import GroupHeader from "./components/group-header";
import MemberList from "./components/member-list";
import { useGroupActions } from "./hooks/use-group-actions";

export default function GroupPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: group, isLoading, error: queryError } = useGroup(id!);
  const error = queryError
    ? queryError instanceof Error
      ? queryError.message
      : "Failed to load group"
    : null;

  const actions = useGroupActions(id!, group);

  if (isLoading) {
    return (
      <div className="bg-background flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <Loader2 className="text-muted-foreground size-8 animate-spin" />
        </main>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="bg-background flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <Card className="bg-card/50 border-border/50 mx-6 w-full max-w-md backdrop-blur-sm">
            <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
              <Users className="text-muted-foreground/40 size-10" />
              <p className="text-muted-foreground">
                {error || "Group not found"}
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

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <PageBackground />
      <Navbar />
      <main className="relative z-10 flex-1 px-6 py-10">
        <div className="mx-auto max-w-3xl">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground mb-6 cursor-pointer gap-2"
            onClick={() => navigate("/game")}
          >
            <ArrowLeft className="size-4" /> Back
          </Button>

          <GroupHeader group={group} />
          <MemberList members={group.members} />
          <DareList
            groupId={id!}
            dares={group.dares}
            currentUserId={actions.currentUserId}
            isOwner={actions.isOwner}
            claimingId={actions.claimingDareId}
            completingId={actions.completingDareId}
            onClaim={actions.handleClaimDare}
            onStatusConfirm={(dareId, status) =>
              actions.setStatusConfirm({ dareId, status })
            }
            onEdit={actions.openEditDare}
            onDeleteConfirm={actions.setDeleteConfirmDareId}
          />
        </div>
      </main>

      <EditDareDrawer
        groupId={id!}
        open={actions.editOpen}
        onOpenChange={actions.setEditOpen}
        dareId={actions.editDareId}
        title={actions.editTitle}
        onTitleChange={actions.setEditTitle}
        desc={actions.editDesc}
        onDescChange={actions.setEditDesc}
        difficulty={actions.editDifficulty}
        onDifficultyChange={actions.setEditDifficulty}
        xp={actions.editXp}
        onXpChange={actions.setEditXp}
      />
      <DareStatusDialog
        statusConfirm={actions.statusConfirm}
        onOpenChange={(open) => {
          if (!open) actions.setStatusConfirm(null);
        }}
        onConfirm={actions.handleCompleteDare}
        isLoading={!!actions.completingDareId}
      />
      <DeleteDareDialog
        dareId={actions.deleteConfirmDareId}
        onOpenChange={(open) => {
          if (!open) actions.setDeleteConfirmDareId(null);
        }}
        onConfirm={actions.handleDeleteDare}
        isLoading={!!actions.deletingDareId}
      />

      <PageFooter />
    </div>
  );
}

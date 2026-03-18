import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { GroupData } from "@/shared/services/group-api";
import Navbar from "@/shared/components/navbar";
import PageBackground from "@/shared/components/page-background";
import PageFooter from "@/shared/components/page-footer";
import { Button } from "@/shared/components/ui/button";

import type { EditDareState } from "../context/group-context";
import type { GroupActions } from "../hooks/use-group-actions";
import CreateDareDialog from "./create-dare-dialog";
import DareList from "./dare-list";
import GroupDialogs from "./group-dialogs";
import GroupHeader from "./group-header";
import MemberList from "./member-list";

interface GroupContentProps {
  id: string;
  group: GroupData;
  actions: GroupActions;
  editOpen: boolean;
  editState: EditDareState | null;
  onEditClose: () => void;
}

export default function GroupContent({
  id,
  group,
  actions,
  editOpen,
  editState,
  onEditClose,
}: GroupContentProps) {
  const navigate = useNavigate();

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
          <CreateDareDialog groupId={id} />
          <DareList
            groupId={id}
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

      <GroupDialogs
        groupId={id}
        editOpen={editOpen}
        editState={editState}
        onEditClose={onEditClose}
        onTitleChange={actions.setEditTitle}
        onDescChange={actions.setEditDesc}
        onDifficultyChange={actions.setEditDifficulty}
        onXpChange={actions.setEditXp}
        statusConfirm={actions.statusConfirm}
        onStatusClose={() => actions.setStatusConfirm(null)}
        onStatusConfirm={actions.handleCompleteDare}
        isCompletingDare={!!actions.completingDareId}
        deleteConfirmDareId={actions.deleteConfirmDareId}
        onDeleteClose={() => actions.setDeleteConfirmDareId(null)}
        onDeleteConfirm={actions.handleDeleteDare}
        isDeletingDare={!!actions.deletingDareId}
      />
      <PageFooter />
    </div>
  );
}

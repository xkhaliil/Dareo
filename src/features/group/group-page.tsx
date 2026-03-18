import { useParams } from "react-router-dom";

import { useGroup } from "@/shared/hooks/use-group-service";

import GroupContent from "./components/group-content";
import GroupLoading from "./components/group-loading";
import GroupNotFound from "./components/group-not-found";
import { GroupProvider, useGroupContext } from "./context/group-context";
import { useGroupActions } from "./hooks/use-group-actions";

// ─── Inner page — has access to GroupContext ──────────────────────────────────

function GroupPageInner({ id }: { id: string }) {
  const { data: group, isLoading, error: queryError } = useGroup(id);
  const { editState, editOpen, closeEditDare } = useGroupContext();
  const actions = useGroupActions(id, group);

  if (isLoading) return <GroupLoading />;

  if (queryError || !group) {
    const message =
      queryError instanceof Error ? queryError.message : "Failed to load group";
    return <GroupNotFound message={message} />;
  }

  return (
    <GroupContent
      id={id}
      group={group}
      actions={actions}
      editOpen={editOpen}
      editState={editState}
      onEditClose={closeEditDare}
    />
  );
}

// ─── Outer page — provides GroupContext ───────────────────────────────────────

export default function GroupPage() {
  const { id } = useParams<{ id: string }>();
  return (
    <GroupProvider>
      <GroupPageInner id={id!} />
    </GroupProvider>
  );
}

import { apiFetch, authHeaders } from "@/lib/api";

export interface GroupPreview {
  id: string;
  name: string;
  code: string;
  members: { user: { id: string; username: string; avatarUrl: string | null } }[];
  myRole: string;
}

export interface GroupMember {
  id: string;
  role: string;
  joinedAt: string;
  user: {
    id: string;
    username: string;
    avatarUrl: string | null;
    rank: string;
    level: number;
  };
}

export interface GroupDare {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  xpReward: number;
  status: string;
  createdAt: string;
  completedAt: string | null;
  author: { id: string; username: string; avatarUrl: string | null };
  assignedTo: { id: string; username: string; avatarUrl: string | null } | null;
}

export interface GroupData {
  id: string;
  name: string;
  code: string;
  createdAt: string;
  members: GroupMember[];
  dares: GroupDare[];
  myRole: string;
}

export function fetchGroups(token: string | null) {
  return apiFetch<GroupPreview[]>("/api/groups", {
    headers: authHeaders(token),
  });
}

export function fetchGroup(id: string, token: string | null) {
  return apiFetch<GroupData>(`/api/groups/${id}`, {
    headers: authHeaders(token),
  });
}

export function createGroup(name: string, token: string | null) {
  return apiFetch<GroupData>("/api/groups", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ name }),
  });
}

export function joinGroup(code: string, token: string | null) {
  return apiFetch<GroupData>("/api/groups/join", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ code }),
  });
}

export function createDare(
  groupId: string,
  data: { title: string; description: string; difficulty: string; xpReward: number },
  token: string | null,
) {
  return apiFetch<GroupDare>(`/api/groups/${groupId}/dares`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

export function claimDare(groupId: string, dareId: string, token: string | null) {
  return apiFetch<GroupDare>(`/api/groups/${groupId}/dares/${dareId}/claim`, {
    method: "PATCH",
    headers: authHeaders(token),
  });
}

export function completeDare(
  groupId: string,
  dareId: string,
  status: "COMPLETED" | "PASSED" | "FAILED",
  token: string | null,
) {
  return apiFetch<GroupDare>(`/api/groups/${groupId}/dares/${dareId}/complete`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify({ status }),
  });
}

export function deleteDare(groupId: string, dareId: string, token: string | null) {
  return apiFetch<void>(`/api/groups/${groupId}/dares/${dareId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
}

export function editDare(
  groupId: string,
  dareId: string,
  data: { title: string; description: string; difficulty: string; xpReward: number },
  token: string | null,
) {
  return apiFetch<GroupDare>(`/api/groups/${groupId}/dares/${dareId}`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
}

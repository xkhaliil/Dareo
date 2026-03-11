import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import {
  fetchGroups,
  fetchGroup,
  createGroup,
  joinGroup,
  createDare,
  claimDare,
  completeDare,
  deleteDare,
  editDare,
} from "@/services/group-api";

export function useGroups() {
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: ["groups"],
    queryFn: () => fetchGroups(token),
  });
}

export function useGroup(id: string) {
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: ["group", id],
    queryFn: () => fetchGroup(id, token),
  });
}

export function useCreateGroup() {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => createGroup(name, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}

export function useJoinGroup() {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code: string) => joinGroup(code, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}

export function useCreateDare(groupId: string) {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { title: string; description: string; difficulty: string; xpReward: number }) =>
      createDare(groupId, data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group", groupId] });
    },
  });
}

export function useClaimDare(groupId: string) {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dareId: string) => claimDare(groupId, dareId, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group", groupId] });
    },
  });
}

export function useCompleteDare(groupId: string) {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { dareId: string; status: "COMPLETED" | "PASSED" | "FAILED" }) =>
      completeDare(groupId, data.dareId, data.status, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group", groupId] });
    },
  });
}

export function useDeleteDare(groupId: string) {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dareId: string) => deleteDare(groupId, dareId, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group", groupId] });
    },
  });
}

export function useEditDare(groupId: string) {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { dareId: string; title: string; description: string; difficulty: string; xpReward: number }) => {
      const { dareId, ...rest } = data;
      return editDare(groupId, dareId, rest, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group", groupId] });
    },
  });
}

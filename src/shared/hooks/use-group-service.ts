import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";

import { useAuthStore } from "@/shared/stores/auth-store";
import {
  claimDare,
  completeDare,
  createDare,
  createGroup,
  deleteDare,
  editDare,
  fetchGroup,
  fetchGroups,
  joinGroup,
  type GroupDare,
  type GroupData,
  type GroupPreview,
} from "@/shared/services/group-api";

export function useGroups(): UseQueryResult<GroupPreview[]> {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: ["groups"],
    queryFn: () => fetchGroups(token),
  });
}

export function useGroup(id: string): UseQueryResult<GroupData> {
  const token = useAuthStore((s) => s.token);
  return useQuery({
    queryKey: ["group", id],
    queryFn: () => fetchGroup(id, token),
  });
}

export function useCreateGroup(): UseMutationResult<GroupData, Error, string> {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => createGroup(name, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}

export function useJoinGroup(): UseMutationResult<GroupData, Error, string> {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => joinGroup(code, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
}

type CreateDareInput = {
  title: string;
  description: string;
  difficulty: string;
  xpReward: number;
};

export function useCreateDare(
  groupId: string,
): UseMutationResult<GroupDare, Error, CreateDareInput> {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDareInput) => createDare(groupId, data, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group", groupId] });
    },
  });
}

export function useClaimDare(
  groupId: string,
): UseMutationResult<GroupDare, Error, string> {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dareId: string) => claimDare(groupId, dareId, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group", groupId] });
    },
  });
}

type CompleteDareInput = {
  dareId: string;
  status: "COMPLETED" | "PASSED" | "FAILED";
};

export function useCompleteDare(
  groupId: string,
): UseMutationResult<GroupDare, Error, CompleteDareInput> {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CompleteDareInput) =>
      completeDare(groupId, data.dareId, data.status, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group", groupId] });
    },
  });
}

export function useDeleteDare(
  groupId: string,
): UseMutationResult<void, Error, string> {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dareId: string) => deleteDare(groupId, dareId, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group", groupId] });
    },
  });
}

type EditDareInput = {
  dareId: string;
  title: string;
  description: string;
  difficulty: string;
  xpReward: number;
};

export function useEditDare(
  groupId: string,
): UseMutationResult<GroupDare, Error, EditDareInput> {
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: EditDareInput) => {
      const { dareId, ...rest } = data;
      return editDare(groupId, dareId, rest, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group", groupId] });
    },
  });
}

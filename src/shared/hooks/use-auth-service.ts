import { useMutation, type UseMutationResult } from "@tanstack/react-query";

import { useAuthStore } from "@/shared/stores/auth-store";
import { signIn, signUp, type AuthResponse } from "@/shared/services/auth-api";

type SignInInput = { email: string; password: string };
type SignUpInput = {
  username: string;
  email: string;
  password: string;
  avatarUrl?: string;
};

export function useSignIn(): UseMutationResult<
  AuthResponse,
  Error,
  SignInInput
> {
  const login = useAuthStore((s) => s.login);
  return useMutation({
    mutationFn: (data: SignInInput) => signIn(data.email, data.password),
    onSuccess: (result) => {
      login(result.token, result.user);
    },
  });
}

export function useSignUp(): UseMutationResult<
  AuthResponse,
  Error,
  SignUpInput
> {
  const login = useAuthStore((s) => s.login);
  return useMutation({
    mutationFn: (data: SignUpInput) => signUp(data),
    onSuccess: (result) => {
      login(result.token, result.user);
    },
  });
}

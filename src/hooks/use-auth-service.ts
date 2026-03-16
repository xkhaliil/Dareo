import { signIn, signUp } from "@/services/auth-api";
import { useAuthStore } from "@/stores/auth-store";
import { useMutation } from "@tanstack/react-query";

export function useSignIn() {
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      signIn(data.email, data.password),
    onSuccess: (result) => {
      login(result.token, result.user);
    },
  });
}

export function useSignUp() {
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: (data: {
      username: string;
      email: string;
      password: string;
      avatarUrl?: string;
    }) => signUp(data),
    onSuccess: (result) => {
      login(result.token, result.user);
    },
  });
}

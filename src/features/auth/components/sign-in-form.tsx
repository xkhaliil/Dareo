import { useState } from "react";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { signInSchema, type SignInValues } from "@/shared/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Dice5, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { useSignIn } from "@/hooks/use-auth-service";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();
  const signInMutation = useSignIn();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({ resolver: zodResolver(signInSchema) });

  async function onSubmit(data: SignInValues) {
    setServerError(null);
    try {
      await signInMutation.mutateAsync({
        email: data.email,
        password: data.password,
      });
      navigate("/game");
    } catch (err) {
      setServerError(
        err instanceof Error
          ? err.message
          : "Network error — is the server running?",
      );
    }
  }

  return (
    <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
      <CardHeader className="text-center">
        <div className="bg-primary/10 mx-auto mb-2 flex size-12 items-center justify-center rounded-xl">
          <Dice5 className="text-primary size-6" />
        </div>
        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
        <CardDescription>Sign in to continue your dares.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
          {serverError && (
            <div className="bg-destructive/10 border-destructive/20 text-destructive rounded-md border px-4 py-3 text-sm">
              {serverError}
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              {...register("email")}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <p className="text-destructive text-sm">{errors.email.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <span className="text-muted-foreground hover:text-foreground cursor-pointer text-xs underline underline-offset-2 transition-colors">
                Forgot password?
              </span>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                {...register("password")}
                aria-invalid={!!errors.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-destructive text-sm">
                {errors.password.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full cursor-pointer gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in…" : "Sign In"}
            {!isSubmitting && <ArrowRight className="size-4" />}
          </Button>
        </form>
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="border-border/50 w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-card text-muted-foreground px-3">
              New to Dareo?
            </span>
          </div>
        </div>
        <Link to="/sign-up" className="block">
          <Button
            variant="outline"
            className="w-full cursor-pointer"
            type="button"
          >
            Create Account
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dice5, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signInSchema, type SignInValues } from "@/lib/auth";
import { useAuth } from "@/context/auth-context";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
  });

  async function onSubmit(data: SignInValues) {
    setServerError(null);
    try {
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const body = await res.json();

      if (!res.ok) {
        setServerError(body.error || "Something went wrong");
        return;
      }

      login(body.token, body.user);
      navigate("/game");
    } catch {
      setServerError("Network error — is the server running?");
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-40%] left-1/2 -translate-x-1/2 w-150 h-150 rounded-full bg-purple-500/10 blur-[120px] animate-pulse-glow" />
        <div
          className="absolute bottom-[-30%] right-[-10%] w-100 h-100 rounded-full bg-indigo-500/8 blur-[100px] animate-pulse-glow"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Dice5 className="size-5 text-primary" />
            <span className="text-lg font-bold tracking-tight">Dareo</span>
          </Link>
          <Link to="/sign-up">
            <Button variant="ghost" size="sm" className="cursor-pointer">
              Sign Up
            </Button>
          </Link>
        </div>
      </nav>

      {/* Main */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md animate-fade-in">
          <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 size-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Dice5 className="size-6 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
              <CardDescription>
                Sign in to continue your dares.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
                {/* Server error */}
                {serverError && (
                  <div className="rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                    {serverError}
                  </div>
                )}

                {/* Email */}
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
                    <p className="text-sm text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <span className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors cursor-pointer">
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
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-destructive">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full gap-2 cursor-pointer"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing in…" : "Sign In"}
                  {!isSubmitting && <ArrowRight className="size-4" />}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-card px-3 text-muted-foreground">
                    New to Dareo?
                  </span>
                </div>
              </div>

              {/* Sign up link */}
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
        </div>
      </main>
    </div>
  );
}

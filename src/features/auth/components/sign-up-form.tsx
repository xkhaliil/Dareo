import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Dice5, Eye, EyeOff, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import { signUpSchema, type SignUpValues } from "@/shared/lib/auth";
import { useUploadThing } from "@/shared/lib/uploadthing";
import { useSignUp } from "@/shared/hooks/use-auth-service";
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

import AvatarUpload from "./avatar-upload";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const signUpMutation = useSignUp();
  const { startUpload } = useUploadThing("avatarUploader");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({ resolver: zodResolver(signUpSchema) });

  function handleAvatarChange(file: File, previewUrl: string) {
    setAvatarFile(file);
    setAvatarPreview(previewUrl);
  }

  async function onSubmit(data: SignUpValues) {
    setServerError(null);
    try {
      let avatarUrl: string | undefined;
      if (avatarFile) {
        setIsUploading(true);
        const uploadResult = await startUpload([avatarFile]);
        setIsUploading(false);
        if (uploadResult?.[0]?.ufsUrl) avatarUrl = uploadResult[0].ufsUrl;
      }
      await signUpMutation.mutateAsync({
        username: data.username,
        email: data.email,
        password: data.password,
        avatarUrl,
      });
      navigate("/game");
    } catch (err) {
      setIsUploading(false);
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
        <CardTitle className="text-2xl font-bold">
          Create your account
        </CardTitle>
        <CardDescription>Join the game. Dare your friends.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
          {serverError && (
            <div className="bg-destructive/10 border-destructive/20 text-destructive rounded-md border px-4 py-3 text-sm">
              {serverError}
            </div>
          )}
          <AvatarUpload
            preview={avatarPreview}
            onChange={handleAvatarChange}
            size="sm"
          />
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="dare_master"
              autoComplete="username"
              {...register("username")}
              aria-invalid={!!errors.username}
            />
            {errors.username && (
              <p className="text-destructive text-sm">
                {errors.username.message}
              </p>
            )}
          </div>
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
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
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
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                {...register("confirmPassword")}
                aria-invalid={!!errors.confirmPassword}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-destructive text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full cursor-pointer gap-2"
            disabled={isSubmitting || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Uploading avatar…
              </>
            ) : isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Creating account…
              </>
            ) : (
              <>
                Create Account <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </form>
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="border-border/50 w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-card text-muted-foreground px-3">
              Already have an account?
            </span>
          </div>
        </div>
        <Link to="/sign-in" className="block">
          <Button
            variant="outline"
            className="w-full cursor-pointer"
            type="button"
          >
            Sign In
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

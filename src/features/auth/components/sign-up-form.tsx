import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dice5, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { signUpSchema, type SignUpValues } from "@/shared/lib/auth";
import { useSignUp } from "@/hooks/use-auth-service";
import { useUploadThing } from "@/shared/lib/uploadthing";
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
      await signUpMutation.mutateAsync({ username: data.username, email: data.email, password: data.password, avatarUrl });
      navigate("/game");
    } catch (err) {
      setIsUploading(false);
      setServerError(err instanceof Error ? err.message : "Network error — is the server running?");
    }
  }

  return (
    <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 size-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Dice5 className="size-6 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">Create your account</CardTitle>
        <CardDescription>Join the game. Dare your friends.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5">
          {serverError && (
            <div className="rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
              {serverError}
            </div>
          )}
          <AvatarUpload preview={avatarPreview} onChange={handleAvatarChange} size="sm" />
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" placeholder="dare_master" autoComplete="username" {...register("username")} aria-invalid={!!errors.username} />
            {errors.username && <p className="text-sm text-destructive">{errors.username.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" autoComplete="email" {...register("email")} aria-invalid={!!errors.email} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" autoComplete="new-password" {...register("password")} aria-invalid={!!errors.password} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" autoComplete="new-password" {...register("confirmPassword")} aria-invalid={!!errors.confirmPassword} />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
          </div>
          <Button type="submit" className="w-full gap-2 cursor-pointer" disabled={isSubmitting || isUploading}>
            {isUploading ? <><Loader2 className="size-4 animate-spin" /> Uploading avatar…</> : isSubmitting ? <><Loader2 className="size-4 animate-spin" /> Creating account…</> : <>Create Account <ArrowRight className="size-4" /></>}
          </Button>
        </form>
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border/50" /></div>
          <div className="relative flex justify-center text-xs"><span className="bg-card px-3 text-muted-foreground">Already have an account?</span></div>
        </div>
        <Link to="/sign-in" className="block">
          <Button variant="outline" className="w-full cursor-pointer" type="button">Sign In</Button>
        </Link>
      </CardContent>
    </Card>
  );
}

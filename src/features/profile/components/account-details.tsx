import { Calendar, Check, Loader2, Mail, User, X } from "lucide-react";

import type { AuthUser } from "@/shared/stores/auth-store";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";

interface AccountDetailsProps {
  user: AuthUser;
  editing: boolean;
  username: string;
  onUsernameChange: (v: string) => void;
  email: string;
  onEmailChange: (v: string) => void;
  error: string | null;
  isSaving: boolean;
  onSave: () => void;
  onCancel: () => void;
}

export default function AccountDetails({
  user,
  editing,
  username,
  onUsernameChange,
  email,
  onEmailChange,
  error,
  isSaving,
  onSave,
  onCancel,
}: AccountDetailsProps) {
  return (
    <Card className="bg-card/50 border-border/50 animate-fade-in-delay-2 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg">Account Details</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {error && (
          <div className="bg-destructive/10 border-destructive/20 text-destructive rounded-md border px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {editing ? (
          <>
            <div className="grid gap-2">
              <Label htmlFor="edit-username">Username</Label>
              <Input
                id="edit-username"
                value={username}
                onChange={(e) => onUsernameChange(e.target.value)}
              />
            </div>
            <Separator />
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
              />
            </div>
            <Separator />
            <div className="flex gap-3 pt-2">
              <Button
                className="flex-1 cursor-pointer gap-2"
                disabled={isSaving}
                onClick={onSave}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Saving…
                  </>
                ) : (
                  <>
                    <Check className="size-4" /> Save Changes
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                className="cursor-pointer gap-2"
                disabled={isSaving}
                onClick={onCancel}
              >
                <X className="size-4" /> Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <User className="text-muted-foreground size-4" />
              <div>
                <p className="text-muted-foreground text-xs">Username</p>
                <p className="text-sm font-medium">{user.username}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center gap-3">
              <Mail className="text-muted-foreground size-4" />
              <div>
                <p className="text-muted-foreground text-xs">Email</p>
                <p className="text-sm font-medium">{user.email}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center gap-3">
              <Calendar className="text-muted-foreground size-4" />
              <div>
                <p className="text-muted-foreground text-xs">Member since</p>
                <p className="text-sm font-medium">2026</p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

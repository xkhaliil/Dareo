import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Separator } from "@/shared/components/ui/separator";
import { User, Mail, Calendar, Loader2, Check, X } from "lucide-react";
import type { AuthUser } from "@/stores/auth-store";

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
    <Card className="bg-card/50 border-border/50 backdrop-blur-sm animate-fade-in-delay-2">
      <CardHeader>
        <CardTitle className="text-lg">Account Details</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {error && (
          <div className="rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {editing ? (
          <>
            <div className="grid gap-2">
              <Label htmlFor="edit-username">Username</Label>
              <Input id="edit-username" value={username} onChange={(e) => onUsernameChange(e.target.value)} />
            </div>
            <Separator />
            <div className="grid gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input id="edit-email" type="email" value={email} onChange={(e) => onEmailChange(e.target.value)} />
            </div>
            <Separator />
            <div className="flex gap-3 pt-2">
              <Button className="flex-1 gap-2 cursor-pointer" disabled={isSaving} onClick={onSave}>
                {isSaving ? <><Loader2 className="size-4 animate-spin" /> Saving…</> : <><Check className="size-4" /> Save Changes</>}
              </Button>
              <Button variant="outline" className="gap-2 cursor-pointer" disabled={isSaving} onClick={onCancel}>
                <X className="size-4" /> Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <User className="size-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Username</p>
                <p className="text-sm font-medium">{user.username}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center gap-3">
              <Mail className="size-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium">{user.email}</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center gap-3">
              <Calendar className="size-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Member since</p>
                <p className="text-sm font-medium">2026</p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

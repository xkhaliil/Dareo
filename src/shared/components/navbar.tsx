import { Dice5, LogOut, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "@/shared/context/auth-context";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="border-border/50 bg-background/80 relative z-50 border-b backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link
          to={isAuthenticated ? "/game" : "/"}
          className="flex items-center gap-2"
        >
          <Dice5 className="text-primary size-5" />
          <span className="text-lg font-bold tracking-tight">Dareo</span>
        </Link>

        {isAuthenticated && user ? (
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="gap-1.5 px-2.5 py-1 text-xs">
              Lv.{user.level} · {user.xp} XP
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus-visible:ring-ring cursor-pointer rounded-full outline-none focus-visible:ring-2">
                  <Avatar size="default">
                    {user.avatarUrl && (
                      <AvatarImage src={user.avatarUrl} alt={user.username} />
                    )}
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {user.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold">
                      {user.username}
                    </span>
                    <span className="text-muted-foreground text-xs font-normal">
                      {user.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => navigate("/profile")}
                  >
                    <User className="size-4" />
                    View Profile
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  variant="destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="size-4" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/sign-in">
              <Button variant="ghost" size="sm" className="cursor-pointer">
                Sign In
              </Button>
            </Link>
            <Link to="/sign-up">
              <Button size="sm" className="cursor-pointer">
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

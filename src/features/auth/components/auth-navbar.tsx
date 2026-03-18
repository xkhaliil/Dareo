import { Dice5 } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/shared/components/ui/button";

interface AuthNavbarProps {
  linkTo: "/sign-in" | "/sign-up";
  linkLabel: string;
}

export default function AuthNavbar({ linkTo, linkLabel }: AuthNavbarProps) {
  return (
    <nav className="border-border/50 bg-background/80 relative z-50 border-b backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <Dice5 className="text-primary size-5" />
          <span className="text-lg font-bold tracking-tight">Dareo</span>
        </Link>
        <Link to={linkTo}>
          <Button variant="ghost" size="sm" className="cursor-pointer">
            {linkLabel}
          </Button>
        </Link>
      </div>
    </nav>
  );
}

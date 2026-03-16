import { Link } from "react-router-dom";
import { Dice5 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface AuthNavbarProps {
  linkTo: "/sign-in" | "/sign-up";
  linkLabel: string;
}

export default function AuthNavbar({ linkTo, linkLabel }: AuthNavbarProps) {
  return (
    <nav className="relative z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Dice5 className="size-5 text-primary" />
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

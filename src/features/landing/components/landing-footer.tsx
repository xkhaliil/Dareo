import { Dice5 } from "lucide-react";

export default function LandingFooter() {
  return (
    <footer className="border-border/50 relative z-10 border-t px-6 py-6">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <Dice5 className="size-3.5" />
          <span>© 2026 Dareo</span>
        </div>
      </div>
    </footer>
  );
}

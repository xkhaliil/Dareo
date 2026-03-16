import { Dice5 } from "lucide-react";

export default function PageFooter() {
  return (
    <footer className="relative z-10 border-t border-border/50 py-6 px-6">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted-foreground text-xs">
          <Dice5 className="size-3.5" />
          <span>© 2026 Dareo</span>
        </div>
      </div>
    </footer>
  );
}

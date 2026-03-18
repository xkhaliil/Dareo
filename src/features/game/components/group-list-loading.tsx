import { Loader2 } from "lucide-react";

export default function GroupListLoading() {
  return (
    <div className="text-muted-foreground flex items-center justify-center py-12">
      <Loader2 className="mr-2 size-5 animate-spin" /> Loading your groups…
    </div>
  );
}

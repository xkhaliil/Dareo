import Navbar from "@/shared/components/navbar";

export default function GroupLoading() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center">
        <div className="text-muted-foreground flex items-center gap-2">
          <span className="size-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Loading group…
        </div>
      </main>
    </div>
  );
}

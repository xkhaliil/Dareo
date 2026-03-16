export default function PageBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="animate-pulse-glow absolute top-[-40%] left-1/2 h-150 w-150 -translate-x-1/2 rounded-full bg-purple-500/10 blur-[120px]" />
      <div
        className="animate-pulse-glow absolute right-[-10%] bottom-[-30%] h-100 w-100 rounded-full bg-indigo-500/8 blur-[100px]"
        style={{ animationDelay: "2s" }}
      />
    </div>
  );
}

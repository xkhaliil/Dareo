export default function PageBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-[-40%] left-1/2 -translate-x-1/2 w-150 h-150 rounded-full bg-purple-500/10 blur-[120px] animate-pulse-glow" />
      <div
        className="absolute bottom-[-30%] right-[-10%] w-100 h-100 rounded-full bg-indigo-500/8 blur-[100px] animate-pulse-glow"
        style={{ animationDelay: "2s" }}
      />
    </div>
  );
}

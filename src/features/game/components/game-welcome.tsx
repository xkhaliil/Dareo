interface GameWelcomeProps {
  username: string;
}

export default function GameWelcome({ username }: GameWelcomeProps) {
  return (
    <div className="animate-fade-in mb-10">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">
        Welcome back, <span className="text-primary">{username}</span> 🎲
      </h1>
      <p className="text-muted-foreground">
        Ready to take on some dares today?
      </p>
    </div>
  );
}

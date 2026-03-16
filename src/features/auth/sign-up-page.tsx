import PageBackground from "@/shared/components/page-background";
import AuthNavbar from "./components/auth-navbar";
import SignUpForm from "./components/sign-up-form";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PageBackground />
      <AuthNavbar linkTo="/sign-in" linkLabel="Sign In" />
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md animate-fade-in">
          <SignUpForm />
          <p className="text-center text-xs text-muted-foreground mt-6">
            By creating an account you agree to our{" "}
            <span className="underline underline-offset-2 cursor-pointer hover:text-foreground transition-colors">Terms of Service</span>{" "}
            and{" "}
            <span className="underline underline-offset-2 cursor-pointer hover:text-foreground transition-colors">Privacy Policy</span>
          </p>
        </div>
      </main>
    </div>
  );
}

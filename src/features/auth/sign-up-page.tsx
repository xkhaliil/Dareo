import PageBackground from "@/shared/components/page-background";

import AuthNavbar from "./components/auth-navbar";
import SignUpForm from "./components/sign-up-form";

export default function SignUpPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <PageBackground />
      <AuthNavbar linkTo="/sign-in" linkLabel="Sign In" />
      <main className="relative z-10 flex flex-1 items-center justify-center px-6 py-12">
        <div className="animate-fade-in w-full max-w-md">
          <SignUpForm />
          <p className="text-muted-foreground mt-6 text-center text-xs">
            By creating an account you agree to our{" "}
            <span className="hover:text-foreground cursor-pointer underline underline-offset-2 transition-colors">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="hover:text-foreground cursor-pointer underline underline-offset-2 transition-colors">
              Privacy Policy
            </span>
          </p>
        </div>
      </main>
    </div>
  );
}

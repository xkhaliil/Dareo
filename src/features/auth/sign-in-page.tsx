import PageBackground from "@/shared/components/page-background";

import AuthNavbar from "./components/auth-navbar";
import SignInForm from "./components/sign-in-form";

export default function SignInPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <PageBackground />
      <AuthNavbar linkTo="/sign-up" linkLabel="Sign Up" />
      <main className="relative z-10 flex flex-1 items-center justify-center px-6 py-12">
        <div className="animate-fade-in w-full max-w-md">
          <SignInForm />
        </div>
      </main>
    </div>
  );
}

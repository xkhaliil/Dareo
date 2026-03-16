import PageBackground from "@/shared/components/page-background";
import AuthNavbar from "./components/auth-navbar";
import SignInForm from "./components/sign-in-form";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PageBackground />
      <AuthNavbar linkTo="/sign-up" linkLabel="Sign Up" />
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md animate-fade-in">
          <SignInForm />
        </div>
      </main>
    </div>
  );
}

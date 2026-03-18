import { Navigate } from "react-router-dom";

import { useAuth } from "@/shared/context/auth-context";
import Navbar from "@/shared/components/navbar";

import LandingBackground from "./features/landing/components/landing-background";
import LandingFeatureCards from "./features/landing/components/landing-feature-cards";
import LandingFooter from "./features/landing/components/landing-footer";
import LandingHero from "./features/landing/components/landing-hero";

export default function App() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/game" replace />;
  }

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <LandingBackground />
      <Navbar />
      <LandingHero />
      <LandingFeatureCards />
      <LandingFooter />
    </div>
  );
}

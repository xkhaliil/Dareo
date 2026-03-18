import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import LandingBackground from "./components/landing-background";
import LandingFeatureCards from "./components/landing-feature-cards";
import LandingFooter from "./components/landing-footer";
import LandingHero from "./components/landing-hero";

describe("LandingHero", () => {
  it("renders the headline", () => {
    render(
      <MemoryRouter>
        <LandingHero />
      </MemoryRouter>,
    );
    expect(screen.getByText(/dare your/i)).toBeInTheDocument();
  });

  it("renders the Start Playing CTA button", () => {
    render(
      <MemoryRouter>
        <LandingHero />
      </MemoryRouter>,
    );
    expect(screen.getByText("Start Playing")).toBeInTheDocument();
  });

  it("CTA button links to /sign-up", () => {
    render(
      <MemoryRouter>
        <LandingHero />
      </MemoryRouter>,
    );
    expect(screen.getByText("Start Playing").closest("a")).toHaveAttribute(
      "href",
      "/sign-up",
    );
  });

  it("renders the season badge", () => {
    render(
      <MemoryRouter>
        <LandingHero />
      </MemoryRouter>,
    );
    expect(screen.getByText(/season 1/i)).toBeInTheDocument();
  });
});

describe("LandingFeatureCards", () => {
  it("renders the Private Groups card", () => {
    render(<LandingFeatureCards />);
    expect(screen.getByText("Private Groups")).toBeInTheDocument();
  });

  it("renders the Earn XP card", () => {
    render(<LandingFeatureCards />);
    expect(screen.getByText("Earn XP")).toBeInTheDocument();
  });

  it("renders the Leaderboard card", () => {
    render(<LandingFeatureCards />);
    expect(screen.getByText("Leaderboard")).toBeInTheDocument();
  });

  it("renders all three feature cards", () => {
    render(<LandingFeatureCards />);
    // Three distinct card headings confirm all cards rendered
    expect(screen.getByText("Private Groups")).toBeInTheDocument();
    expect(screen.getByText("Earn XP")).toBeInTheDocument();
    expect(screen.getByText("Leaderboard")).toBeInTheDocument();
  });
});

describe("LandingFooter", () => {
  it("renders the copyright notice", () => {
    render(<LandingFooter />);
    expect(screen.getByText(/2026 Dareo/)).toBeInTheDocument();
  });
});

describe("LandingBackground", () => {
  it("renders without crashing", () => {
    const { container } = render(<LandingBackground />);
    expect(container.firstChild).not.toBeNull();
  });
});

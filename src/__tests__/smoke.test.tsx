import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

// Mock next-auth/react so SessionProvider doesn't need a real provider
vi.mock("next-auth/react", () => ({
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
  useSession: () => ({ data: null, status: "unauthenticated" }),
}));

// Mock next/navigation since page.tsx might use router features
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn() }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

import AuthProvider from "@/components/providers/AuthProvider";

describe("smoke tests", () => {
  it("AuthProvider renders children without crashing", () => {
    render(
      <AuthProvider>
        <div data-testid="child">Hello PugLife</div>
      </AuthProvider>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByText("Hello PugLife")).toBeInTheDocument();
  });

  it("type definitions are valid and importable", async () => {
    const types = await import("@/lib/types");
    expect(types.PRIORITY_CONFIG).toBeDefined();
    expect(types.PRIORITY_CONFIG.paw.label).toBe("Chill Pug");
    expect(types.CATEGORY_CONFIG.pugcare.label).toBe("Lollie Care");
    expect(types.TAB_CONFIG.dashboard.label).toBe("Home");
    expect(Object.keys(types.MOOD_CONFIG)).toHaveLength(5);
  });

  it("all expected tabs are defined", async () => {
    const { TAB_CONFIG } = await import("@/lib/types");
    const tabs = Object.keys(TAB_CONFIG);
    expect(tabs).toContain("dashboard");
    expect(tabs).toContain("tasks");
    expect(tabs).toContain("track");
    expect(tabs).toContain("rewards");
    expect(tabs).toContain("lollie");
  });
});

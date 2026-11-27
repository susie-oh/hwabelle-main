import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "@/hooks/useCart";
import { TooltipProvider } from "@/components/ui/tooltip";
import CartDrawer from "@/components/CartDrawer";
import WelcomeDiscountPopup from "@/components/offers/WelcomeDiscountPopup";
import Index from "@/pages/Index";
import Shop from "@/pages/Shop";
import ProductDetail from "@/pages/ProductDetail";

// Mock IntersectionObserver & matchMedia for Framer Motion / Embla / Radix in jsdom
beforeEach(() => {
  localStorage.clear();
  class MockIO {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  vi.stubGlobal("IntersectionObserver", MockIO);
  vi.stubGlobal("ResizeObserver", MockIO);
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
});

afterEach(() => {
  vi.useRealTimers();
});

function renderApp(initialEntry = "/") {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <CartProvider>
        <TooltipProvider>
          <MemoryRouter initialEntries={[initialEntry]}>
            <CartDrawer />
            <WelcomeDiscountPopup />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
            </Routes>
          </MemoryRouter>
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>,
  );
}

describe("BFCM 2026 Full Site Integration & Live Timer Verification", () => {
  it("ticks the countdown timer every second, switches to Cyber Monday at midnight PT, and auto-resets Dec 1 PT", () => {
    vi.useFakeTimers();
    // Start at Sat Nov 28, 2026 00:00:00 PST (2026-11-28T08:00:00.000Z -> 2d 23h 59m 59s remaining)
    vi.setSystemTime(new Date("2026-11-28T08:00:00.000Z"));

    renderApp("/");

    // 1. Verify Weekend Announcement Bar + Hero + Initial Timer
    const bar = screen.getByTestId("bfcm-announcement-bar");
    expect(bar).toHaveAttribute("href", "/product/flower-press-kit");
    expect(bar.textContent).toContain(
      "Black Friday Weekend · 20% Off The Hwabelle Flower Press Kit · Ends Nov 30",
    );

    const inlineTimer = screen.getByTestId("bfcm-countdown-inline");
    expect(inlineTimer.textContent).toBe("2d23h59m59s");

    expect(screen.getByTestId("bfcm-hero-eyebrow").textContent).toBe("BLACK FRIDAY WEEKEND");
    expect(screen.getByText("Preserve The Flowers")).toBeInTheDocument();
    expect(screen.getByText("Keep The Story")).toBeInTheDocument();
    expect(
      screen.getByText("Keepsake inspiration. Frame and flowers not included."),
    ).toBeInTheDocument();
    expect(screen.getByText("From Flower To Keepsake")).toBeInTheDocument();
    expect(screen.getByText("Read The Flower Pressing Guides")).toHaveAttribute(
      "href",
      "/resources",
    );

    // Confirm 10% Welcome Popup pill is suppressed during BFCM
    expect(screen.queryByLabelText("Claim 10% Off Offer")).toBeNull();

    // 2. Advance 4 seconds -> confirm live 1-second interval ticks timer from 59s -> 55s!
    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(screen.getByTestId("bfcm-countdown-inline").textContent).toBe("2d23h59m55s");

    // 3. Jump to Mon Nov 30, 2026 09:00:00 a.m. PST (2026-11-30T17:00:00.000Z -> 14h 59m 59s left)
    act(() => {
      vi.setSystemTime(new Date("2026-11-30T17:00:00.000Z"));
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByTestId("bfcm-hero-eyebrow").textContent).toBe("CYBER MONDAY");
    expect(screen.getByText("Last Day To Save 20%")).toBeInTheDocument();
    expect(screen.getByText("Shop Before The Offer Ends")).toBeInTheDocument();
    expect(screen.getByText("Offer ends tonight at 11:59 p.m. Pacific.")).toBeInTheDocument();

    // 4. Jump to Tue Dec 1, 2026 12:00:01 a.m. PST (2026-12-01T08:00:01.000Z -> Offer ended!)
    act(() => {
      vi.setSystemTime(new Date("2026-12-01T08:00:01.000Z"));
      vi.advanceTimersByTime(1000);
    });
    expect(screen.queryByTestId("bfcm-announcement-bar")).toBeNull();
    expect(screen.queryByTestId("bfcm-hero")).toBeNull();
    expect(screen.getByText("Begin Here")).toBeInTheDocument();
  });

  it("renders Shop page with BFCM badge on Kit only and keeps AI Designer out of the promotion", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-28T18:00:00.000Z"));

    renderApp("/shop?utm_source=hwabelle_list&utm_medium=email&utm_campaign=bfcm_2026&utm_content=bf_launch");

    expect(screen.getByText("Save 20% On The Hwabelle Flower Press Kit")).toBeInTheDocument();
    const badges = screen.getAllByText("BFCM Weekend · Save 20%");
    expect(badges).toHaveLength(1); // Strictly only on the physical kit card, never on AI Designer
    expect(screen.getByText("$39.99")).toBeInTheDocument();
    expect(screen.getByText("$49.99")).toBeInTheDocument();
    expect(screen.getByText("$19.99")).toBeInTheDocument();
  });

  it("renders Product page compliant copy and blocks 10% welcome code stacking in Cart during BFCM", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-28T18:00:00.000Z"));

    renderApp("/product/flower-press-kit");

    expect(screen.getByTestId("product-offer-label").textContent).toBe("BFCM Weekend · Save 20%");
    expect(
      screen.getByRole("heading", { level: 1, name: "Hwabelle Acrylic Flower Press Kit" }),
    ).toBeInTheDocument();

    // Ensure unverified "Free US shipping" claim was replaced with compliant neutral copy
    expect(screen.queryByText(/Free US shipping/i)).toBeNull();
    expect(screen.getByText(/available delivery options at checkout/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Returns Policy/i })).toHaveAttribute("href", "/returns");

    // Add kit to cart -> CartDrawer opens at $39.99
    fireEvent.click(screen.getByRole("button", { name: /Add To Cart/i }));
    expect(screen.getByText("Checkout · $39.99")).toBeInTheDocument();

    // Attempt to stack 10% welcome code WELCOME10 -> blocked cleanly!
    const promoInput = screen.getByPlaceholderText("Promo code");
    fireEvent.change(promoInput, { target: { value: "WELCOME10" } });
    fireEvent.click(screen.getByRole("button", { name: "Apply" }));

    expect(
      screen.getByText(/cannot be combined with another promotional discount/i),
    ).toBeInTheDocument();
    expect(screen.getByText("Checkout · $39.99")).toBeInTheDocument();
  });
});

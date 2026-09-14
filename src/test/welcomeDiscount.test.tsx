import { describe, it, expect, beforeEach, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CartProvider, useCart } from "@/hooks/useCart";
import { WelcomeDiscountPopup } from "@/components/offers/WelcomeDiscountPopup";
import { MemoryRouter } from "react-router-dom";

// Helper component to test useCart discount methods
const CartTestConsumer = () => {
  const {
    items,
    addItem,
    totalPrice,
    discountCode,
    discountPercent,
    discountAmount,
    finalPrice,
    applyDiscountCode,
    removeDiscountCode,
  } = useCart();

  return (
    <div>
      <span data-testid="total-price">{totalPrice}</span>
      <span data-testid="discount-code">{discountCode || "none"}</span>
      <span data-testid="discount-percent">{discountPercent}</span>
      <span data-testid="discount-amount">{discountAmount}</span>
      <span data-testid="final-price">{finalPrice}</span>
      <button
        data-testid="add-kit"
        onClick={() => addItem({ id: "flower-press-kit", name: "Flower Press Kit", price: 49.99 })}
      >
        Add Kit
      </button>
      <button
        data-testid="apply-welcome"
        onClick={() => applyDiscountCode("WELCOME10")}
      >
        Apply WELCOME10
      </button>
      <button
        data-testid="apply-invalid"
        onClick={() => applyDiscountCode("INVALID")}
      >
        Apply Invalid
      </button>
      <button data-testid="remove-discount" onClick={removeDiscountCode}>
        Remove Discount
      </button>
    </div>
  );
};

describe("Cart Discount Integration", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("calculates 10% discount correctly when WELCOME10 is applied", () => {
    render(
      <CartProvider>
        <CartTestConsumer />
      </CartProvider>
    );

    // Initial state
    expect(screen.getByTestId("total-price").textContent).toBe("0");
    expect(screen.getByTestId("discount-code").textContent).toBe("none");

    // Add kit ($49.99)
    fireEvent.click(screen.getByTestId("add-kit"));
    expect(screen.getByTestId("total-price").textContent).toBe("49.99");
    expect(screen.getByTestId("final-price").textContent).toBe("49.99");

    // Apply WELCOME10
    fireEvent.click(screen.getByTestId("apply-welcome"));
    expect(screen.getByTestId("discount-code").textContent).toBe("WELCOME10");
    expect(screen.getByTestId("discount-percent").textContent).toBe("10");
    expect(screen.getByTestId("discount-amount").textContent).toBe("5"); // 49.99 * 0.10 = 5.00 (rounded to 5)
    expect(screen.getByTestId("final-price").textContent).toBe("44.99"); // 49.99 - 5.00 = 44.99

    // Remove discount
    fireEvent.click(screen.getByTestId("remove-discount"));
    expect(screen.getByTestId("discount-code").textContent).toBe("none");
    expect(screen.getByTestId("final-price").textContent).toBe("49.99");
  });

  it("rejects invalid discount codes", () => {
    render(
      <CartProvider>
        <CartTestConsumer />
      </CartProvider>
    );

    fireEvent.click(screen.getByTestId("add-kit"));
    fireEvent.click(screen.getByTestId("apply-invalid"));
    expect(screen.getByTestId("discount-code").textContent).toBe("none");
    expect(screen.getByTestId("final-price").textContent).toBe("49.99");
  });
});

describe("WelcomeDiscountPopup Component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders floating trigger button on storefront pages", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <CartProvider>
          <WelcomeDiscountPopup />
        </CartProvider>
      </MemoryRouter>
    );

    const triggerBtn = screen.getByRole("button", { name: /Claim 10% Off Offer/i });
    expect(triggerBtn).toBeDefined();
    expect(triggerBtn.textContent).toContain("Get 10% Off");
  });

  it("opens modal dialog when trigger button is clicked", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <CartProvider>
          <WelcomeDiscountPopup />
        </CartProvider>
      </MemoryRouter>
    );

    const triggerBtn = screen.getByRole("button", { name: /Claim 10% Off Offer/i });
    fireEvent.click(triggerBtn);

    await waitFor(() => {
      expect(screen.getByText(/Get 10% Off Your First Order/i)).toBeDefined();
      expect(screen.getByPlaceholderText("you@example.com")).toBeDefined();
      expect(screen.getByRole("button", { name: /Claim 10% Off \+ Free Guide/i })).toBeDefined();
    });
  });
});

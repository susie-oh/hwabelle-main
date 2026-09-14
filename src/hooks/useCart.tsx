import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
}

const VALID_DISCOUNTS: Record<string, number> = {
    "WELCOME10": 10,
    "BLOOM10": 10,
    "HWABELLE10": 10,
};

interface CartContextType {
    items: CartItem[];
    addItem: (item: Omit<CartItem, "quantity">) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    itemCount: number;
    totalPrice: number;
    discountCode: string | null;
    discountPercent: number;
    discountAmount: number;
    finalPrice: number;
    applyDiscountCode: (code: string) => { success: boolean; message: string };
    removeDiscountCode: () => void;
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "hwabelle-cart";
const DISCOUNT_STORAGE_KEY = "hwabelle-discount";

function loadCart(): CartItem[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

function loadDiscountCode(): string | null {
    try {
        const stored = localStorage.getItem(DISCOUNT_STORAGE_KEY);
        if (stored && VALID_DISCOUNTS[stored.toUpperCase().trim()]) {
            return stored.toUpperCase().trim();
        }
        return null;
    } catch {
        return null;
    }
}

function saveCart(items: CartItem[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>(loadCart);
    const [discountCode, setDiscountCode] = useState<string | null>(loadDiscountCode);
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        saveCart(items);
    }, [items]);

    useEffect(() => {
        if (discountCode) {
            localStorage.setItem(DISCOUNT_STORAGE_KEY, discountCode);
        } else {
            localStorage.removeItem(DISCOUNT_STORAGE_KEY);
        }
    }, [discountCode]);

    const addItem = useCallback((newItem: Omit<CartItem, "quantity">) => {
        setItems((prev) => {
            const existing = prev.find((item) => item.id === newItem.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === newItem.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...newItem, quantity: 1 }];
        });
        setIsCartOpen(true);
    }, []);

    const removeItem = useCallback((id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    }, []);

    const updateQuantity = useCallback((id: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(id);
            return;
        }
        setItems((prev) =>
            prev.map((item) => (item.id === id ? { ...item, quantity } : item))
        );
    }, [removeItem]);

    const clearCart = useCallback(() => {
        setItems([]);
    }, []);

    const applyDiscountCode = useCallback((code: string): { success: boolean; message: string } => {
        const normalized = (code || "").trim().toUpperCase();
        if (!normalized) {
            return { success: false, message: "Please enter a discount code." };
        }
        const percent = VALID_DISCOUNTS[normalized];
        if (percent) {
            setDiscountCode(normalized);
            return { success: true, message: `10% discount applied with code ${normalized}!` };
        }
        return { success: false, message: "Invalid discount code." };
    }, []);

    const removeDiscountCode = useCallback(() => {
        setDiscountCode(null);
    }, []);

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const discountPercent = discountCode ? (VALID_DISCOUNTS[discountCode] || 0) : 0;
    const discountAmount = Number(((totalPrice * discountPercent) / 100).toFixed(2));
    const finalPrice = Math.max(0, Number((totalPrice - discountAmount).toFixed(2)));

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                itemCount,
                totalPrice,
                discountCode,
                discountPercent,
                discountAmount,
                finalPrice,
                applyDiscountCode,
                removeDiscountCode,
                isCartOpen,
                openCart: () => setIsCartOpen(true),
                closeCart: () => setIsCartOpen(false),
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}

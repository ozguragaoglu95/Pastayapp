import { createContext, useContext, useState, ReactNode, useCallback, useMemo } from "react";
import { CartItem } from "@/data/types";
import { getTemplateById } from "@/data/mock-data";

interface CartContextType {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (templateId: string) => void;
    updateQuantity: (templateId: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([]);

    const addItem = useCallback((item: CartItem) => {
        setItems((prev) => {
            const key = JSON.stringify({
                templateId: item.templateProductId,
                selectedOptions: item.selectedOptions,
                cakeNote: item.cakeNote,
                customExtras: item.customExtras
            });
            const existing = prev.find(
                (i) => JSON.stringify({
                    templateId: i.templateProductId,
                    selectedOptions: i.selectedOptions,
                    cakeNote: i.cakeNote,
                    customExtras: i.customExtras
                }) === key
            );
            if (existing) {
                return prev.map((i) =>
                    JSON.stringify({
                        templateId: i.templateProductId,
                        selectedOptions: i.selectedOptions,
                        cakeNote: i.cakeNote,
                        customExtras: i.customExtras
                    }) === key
                        ? { ...i, quantity: i.quantity + item.quantity }
                        : i
                );
            }
            return [...prev, item];
        });
    }, []);

    const removeItem = useCallback((templateId: string) => {
        setItems((prev) => prev.filter((i) => i.templateProductId !== templateId));
    }, []);

    const updateQuantity = useCallback((templateId: string, quantity: number) => {
        if (quantity <= 0) {
            setItems((prev) => prev.filter((i) => i.templateProductId !== templateId));
            return;
        }
        setItems((prev) =>
            prev.map((i) =>
                i.templateProductId === templateId
                    ? { ...i, quantity }
                    : i
            )
        );
    }, []);

    const clearCart = useCallback(() => setItems([]), []);

    const totalItems = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items]);
    const totalPrice = useMemo(() => items.reduce((s, i) => s + (i.unitPrice * i.quantity), 0), [items]);

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within CartProvider");
    return ctx;
};

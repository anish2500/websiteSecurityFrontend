"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Cart, getCart, addToCart, updateCartItem, removeFromCart, CartItem } from "@/lib/api/cart";
interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  addItem: (plantId: string, quantity?: number) => Promise<void>;
  updateItem: (plantId: string, quantity: number) => Promise<void>;
  removeItem: (plantId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
  cartCount: number;
}
const CartContext = createContext<CartContextType | undefined>(undefined);
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const refreshCart = async () => {
    try {
      const cartData = await getCart();
      setCart(cartData);
    } catch (error) {
      setCart(null);
    } finally {
      setLoading(false);
    }
  };
  const addItem = async (plantId: string, quantity: number = 1) => {
    await addToCart(plantId, quantity);
    await refreshCart();
  };
  const updateItem = async (plantId: string, quantity: number) => {
    await updateCartItem(plantId, quantity);
    await refreshCart();
  };
  const removeItem = async (plantId: string) => {
    await removeFromCart(plantId);
    await refreshCart();
  };
  useEffect(() => {
    refreshCart();
  }, []);
  const cartCount = cart?.items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0) || 0;
  return (
    <CartContext.Provider value={{ cart, loading, addItem, updateItem, removeItem, refreshCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
};
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};

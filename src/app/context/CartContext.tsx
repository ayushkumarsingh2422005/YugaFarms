"use client";
import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";

export type CartItem = {
  productId: number;
  variantId: number;
  quantity: number;
  price: number;
  weight: number;
  productTitle: string;
  productImage?: string;
};

export type CartContextType = {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  addToCart: (item: Omit<CartItem, 'quantity'>) => Promise<void>;
  removeFromCart: (productId: number, variantId: number) => Promise<void>;
  updateQuantity: (productId: number, variantId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  syncCart: () => Promise<void>;
};

export const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEYS = {
  cart: "ygf_cart",
};

const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:1337";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user, jwt } = useAuth();

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const storedCart = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEYS.cart) : null;
      if (storedCart) {
        setItems(JSON.parse(storedCart));
      }
    } catch (e) {
      console.error("Error loading cart from localStorage:", e);
    }
  }, []);

  // Sync cart with backend when user logs in
  useEffect(() => {
    if (user && jwt) {
      syncCart();
    }
  }, [user, jwt]);

  // Persist cart to localStorage whenever items change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(items));
    }
  }, [items]);

  const totalItems = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const totalPrice = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [items]);

  const syncCart = useCallback(async () => {
    if (!user || !jwt) return;

    try {
      setIsLoading(true);
      
      // Get current cart from backend
      const response = await fetch(`${BACKEND}/api/users/me`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });

      if (response.ok) {
        const userData = await response.json();
        const backendCart = userData.cart || [];
        
        // Merge with local cart (backend takes precedence for conflicts)
        const mergedCart = [...items];
        
        backendCart.forEach((backendItem: any) => {
          const existingIndex = mergedCart.findIndex(
            item => item.productId === backendItem.productId && item.variantId === backendItem.variantId
          );
          
          if (existingIndex >= 0) {
            // Update existing item with backend data
            mergedCart[existingIndex] = backendItem;
          } else {
            // Add new item from backend
            mergedCart.push(backendItem);
          }
        });

        setItems(mergedCart);
      }
    } catch (error) {
      console.error("Error syncing cart:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user, jwt, items]);

  const saveCartToBackend = useCallback(async (cartItems: CartItem[]) => {
    if (!user || !jwt) return;

    try {
      const response = await fetch(`${BACKEND}/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          cart: cartItems,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save cart to backend");
      }
    } catch (error) {
      console.error("Error saving cart to backend:", error);
      throw error;
    }
  }, [user, jwt]);

  const addToCart = useCallback(async (newItem: Omit<CartItem, 'quantity'>) => {
    try {
      setIsLoading(true);
      
      const existingItemIndex = items.findIndex(
        item => item.productId === newItem.productId && item.variantId === newItem.variantId
      );

      let updatedItems: CartItem[];

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        updatedItems = items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item
        updatedItems = [...items, { ...newItem, quantity: 1 }];
      }

      setItems(updatedItems);
      
      // Save to backend if user is logged in
      if (user && jwt) {
        await saveCartToBackend(updatedItems);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [items, user, jwt, saveCartToBackend]);

  const removeFromCart = useCallback(async (productId: number, variantId: number) => {
    try {
      setIsLoading(true);
      
      const updatedItems = items.filter(
        item => !(item.productId === productId && item.variantId === variantId)
      );

      setItems(updatedItems);
      
      // Save to backend if user is logged in
      if (user && jwt) {
        await saveCartToBackend(updatedItems);
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [items, user, jwt, saveCartToBackend]);

  const updateQuantity = useCallback(async (productId: number, variantId: number, quantity: number) => {
    try {
      setIsLoading(true);
      
      if (quantity <= 0) {
        await removeFromCart(productId, variantId);
        return;
      }

      const updatedItems = items.map(item =>
        item.productId === productId && item.variantId === variantId
          ? { ...item, quantity }
          : item
      );

      setItems(updatedItems);
      
      // Save to backend if user is logged in
      if (user && jwt) {
        await saveCartToBackend(updatedItems);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [items, user, jwt, saveCartToBackend, removeFromCart]);

  const clearCart = useCallback(async () => {
    try {
      setIsLoading(true);
      
      setItems([]);
      
      // Save to backend if user is logged in
      if (user && jwt) {
        await saveCartToBackend([]);
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user, jwt, saveCartToBackend]);

  const value = useMemo<CartContextType>(() => ({
    items,
    totalItems,
    totalPrice,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    syncCart,
  }), [items, totalItems, totalPrice, isLoading, addToCart, removeFromCart, updateQuantity, clearCart, syncCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

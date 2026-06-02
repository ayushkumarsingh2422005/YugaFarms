"use client";
import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import { isAuthFailure, parseApiErrorMessage } from "@/lib/authSession";
import PhoneOTPModal from "@/components/PhoneOTPModal";
import AddressModal from "@/components/AddressModal";
import { AppliedCoupon, computeDiscountForSubtotal } from "@/lib/coupon";
import {
  lineToGaItem,
  trackAddToCart,
  trackRemoveFromCart,
} from "@/lib/gtag";
import { notifyCartSync } from "@/lib/waNotify";
import { profileToCheckoutAddress } from "@/lib/userProfile";

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
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  showCheckoutOTP: () => void;
  addToCart: (
    item: Omit<CartItem, "quantity">,
    options?: { openCart?: boolean }
  ) => Promise<void>;
  removeFromCart: (productId: number, variantId: number) => Promise<void>;
  updateQuantity: (productId: number, variantId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  syncCart: () => Promise<void>;
  couponCode: string;
  setCouponCode: (code: string) => void;
  couponError: string;
  couponSuccess: string;
  discount: number;
  appliedCoupon: AppliedCoupon | null;
  verifyCoupon: (codeOverride?: string) => Promise<void>;
  removeCoupon: () => void;
  couponVerifying: boolean;
};

export const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEYS = {
  cart: "ygf_cart",
  coupon: "ygf_coupon",
};

const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:1337";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const { user, jwt, userProfile, profileRevision, updateUserProfileFromCheckout, redirectToLogin } = useAuth();
  const isSyncingRef = useRef<boolean>(false);
  const skipCouponPersistRef = useRef(true);

  // Modal states
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [pendingCartItem, setPendingCartItem] = useState<Omit<CartItem, 'quantity'> | null>(null);
  const [userPhone, setUserPhone] = useState<string>("");

  useEffect(() => {
    if (userProfile?.phone) {
      setUserPhone(userProfile.phone);
    }
  }, [userProfile?.phone]);

  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [couponVerifying, setCouponVerifying] = useState(false);

  // Load cart from localStorage on mount

  const syncCart = useCallback(async () => {
    if (!user || !jwt || isSyncingRef.current) return;

    try {
      isSyncingRef.current = true;
      setIsLoading(true);

      // Get current cart from backend
      const response = await fetch(`${BACKEND}/api/users/me`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });

      if (response.ok) {
        const userData = await response.json();
        const backendCart = userData.cart || [];

        // Merge with local cart (backend takes precedence for conflicts)
        // Use functional update to avoid stale closure and infinite loop
        setItems(prevItems => {
          const mergedCart = [...prevItems];

          backendCart.forEach((backendItem: CartItem) => {
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

          return mergedCart;
        });
      } else {
        const message = await parseApiErrorMessage(response, "Failed to sync cart");
        if (isAuthFailure(response.status, message)) {
          redirectToLogin("/cart");
          return;
        }
      }
    } catch (error) {
      console.error("Error syncing cart:", error);
    } finally {
      setIsLoading(false);
      isSyncingRef.current = false;
    }
  }, [user, jwt, redirectToLogin]);
  useEffect(() => {
    try {
      const storedCart = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEYS.cart) : null;
      if (storedCart) {
        setItems(JSON.parse(storedCart));
      }
      const storedCoupon = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEYS.coupon) : null;
      if (storedCoupon) {
        const parsed = JSON.parse(storedCoupon) as {
          couponCode?: string;
          appliedCoupon?: AppliedCoupon | null;
        };
        if (parsed.couponCode !== undefined) setCouponCode(parsed.couponCode);
        if (parsed.appliedCoupon) {
          const ac = parsed.appliedCoupon;
          if (new Date() <= new Date(ac.Expiry) && ac.Count > 0) {
            setAppliedCoupon(ac);
          }
        }
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
  }, [user, jwt, syncCart]);

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

  // Persist coupon (code + applied snapshot) for cross-page continuity
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (skipCouponPersistRef.current) {
      skipCouponPersistRef.current = false;
      return;
    }
    localStorage.setItem(
      STORAGE_KEYS.coupon,
      JSON.stringify({ couponCode, appliedCoupon })
    );
  }, [couponCode, appliedCoupon]);

  const discount = useMemo(
    () => computeDiscountForSubtotal(appliedCoupon, totalPrice),
    [appliedCoupon, totalPrice]
  );

  // Keep success message in sync when cart total changes (percentage coupons)
  useEffect(() => {
    if (!appliedCoupon) return;
    if (discount <= 0) {
      setCouponSuccess("");
      return;
    }
    setCouponSuccess(`Coupon applied! You saved ₹${discount.toFixed(2)}`);
  }, [appliedCoupon, discount]);

  const removeCoupon = useCallback(() => {
    setCouponError("");
    setCouponSuccess("");
    setAppliedCoupon(null);
    setCouponCode("");
  }, []);

  const verifyCoupon = useCallback(
    async (codeOverride?: string) => {
      const codeToVerify = (codeOverride ?? couponCode).trim().toUpperCase();
      setCouponError("");
      setCouponSuccess("");

      if (!codeToVerify) {
        setCouponError("Please enter a coupon code");
        setAppliedCoupon(null);
        return;
      }

      setCouponVerifying(true);
      try {
        const response = await fetch(
          `${BACKEND}/api/coupons?filters[Code][$eq]=${encodeURIComponent(codeToVerify)}`,
          {
            headers: {
              Authorization: `Bearer ${jwt ?? ""}`,
            },
          }
        );

        const data = await response.json();

        if (!data.data || data.data.length === 0) {
          setCouponError("Invalid coupon code");
          setAppliedCoupon(null);
          return;
        }

        const coupon = data.data[0];
        const couponAttributes = coupon.attributes || coupon;
        const couponId = coupon.id;

        if (new Date() > new Date(couponAttributes.Expiry)) {
          setCouponError("Coupon has expired");
          setAppliedCoupon(null);
          return;
        }

        if (couponAttributes.Count <= 0) {
          setCouponError("Coupon usage limit reached");
          setAppliedCoupon(null);
          return;
        }

        const next: AppliedCoupon = {
          id: couponId,
          Code: couponAttributes.Code,
          Expiry: couponAttributes.Expiry,
          Count: couponAttributes.Count,
          Percentage: couponAttributes.Percentage,
          Value: Number(couponAttributes.Value),
        };

        const calculatedDiscount = computeDiscountForSubtotal(next, totalPrice);

        setAppliedCoupon(next);
        setCouponCode(codeToVerify);
        setCouponSuccess(`Coupon applied! You saved ₹${calculatedDiscount.toFixed(2)}`);
      } catch (error) {
        console.error("Coupon verification error:", error);
        setCouponError("Failed to verify coupon");
        setAppliedCoupon(null);
      } finally {
        setCouponVerifying(false);
      }
    },
    [couponCode, jwt, totalPrice]
  );


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
        const message = await parseApiErrorMessage(response, "Failed to save cart to backend");
        if (isAuthFailure(response.status, message)) {
          redirectToLogin("/cart");
          return;
        }
        throw new Error(message);
      }

      const phone = (user as { Phone?: string })?.Phone;
      notifyCartSync({
        userId: user.id,
        phone: phone ?? undefined,
        items: cartItems,
        totalItems: cartItems.reduce((s, i) => s + i.quantity, 0),
        totalPrice: cartItems.reduce((s, i) => s + i.price * i.quantity, 0),
      });
    } catch (error) {
      console.error("Error saving cart to backend:", error);
      throw error;
    }
  }, [user, jwt, redirectToLogin]);

  const checkUserAddress = useCallback((): boolean => {
    if (!userProfile) return false;
    return !!(
      userProfile.addressLine1 &&
      userProfile.city &&
      userProfile.state &&
      userProfile.pin
    );
  }, [userProfile]);

  const saveAddressToBackend = useCallback(async (address: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  }) => {
    if (!user || !jwt) return;
    await updateUserProfileFromCheckout(address);
  }, [user, jwt, updateUserProfileFromCheckout]);

  const addToCartDirectly = useCallback(
    async (
      newItem: Omit<CartItem, "quantity">,
      options?: { openCart?: boolean }
    ) => {
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

        // Meta Pixel AddToCart tracking
        if (typeof window !== "undefined" && (window as any).fbq) {
          (window as any).fbq('track', 'AddToCart', {
            value: newItem.price,
            currency: 'INR',
            content_name: newItem.productTitle,
            content_ids: [newItem.productId.toString()],
            content_type: 'product',
          });
        }

        trackAddToCart(lineToGaItem({ ...newItem, quantity: 1 }));

        // Save to backend if user is logged in
        if (user && jwt) {
          await saveCartToBackend(updatedItems);
        }

        if (options?.openCart !== false) {
          setIsCartOpen(true);
        }
      } catch (error) {
        console.error("Error adding to cart:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [items, user, jwt, saveCartToBackend]
  );

  const handleOTPSuccess = useCallback(async (phone: string) => {
    setUserPhone(phone);

    // After OTP login, directly proceed to checkout or add cart item
    if (pendingCartItem) {
      // If there was a pending cart item, add it
      await addToCartDirectly(pendingCartItem);
      setPendingCartItem(null);
    } else if (items.length > 0) {
      // If OTP was triggered for checkout (no pending item but cart has items), redirect to checkout
      setIsCartOpen(false);
      // Use setTimeout to ensure state updates are complete
      setTimeout(() => {
        window.location.href = '/checkout';
      }, 100);
    }
  }, [pendingCartItem, addToCartDirectly, items.length]);

  const addToCart = useCallback(
    async (
      newItem: Omit<CartItem, "quantity">,
      options?: { openCart?: boolean }
    ) => {
      await addToCartDirectly(newItem, options);
    },
    [addToCartDirectly]
  );

  const removeFromCart = useCallback(async (productId: number, variantId: number) => {
    try {
      setIsLoading(true);

      const removed = items.find(
        (item) => item.productId === productId && item.variantId === variantId
      );
      if (removed) {
        trackRemoveFromCart(lineToGaItem(removed));
      }

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

      const prevItem = items.find(
        (item) => item.productId === productId && item.variantId === variantId
      );
      if (prevItem) {
        if (quantity > prevItem.quantity) {
          trackAddToCart(
            lineToGaItem({
              ...prevItem,
              quantity: quantity - prevItem.quantity,
            })
          );
        } else if (quantity < prevItem.quantity) {
          trackRemoveFromCart(
            lineToGaItem({
              ...prevItem,
              quantity: prevItem.quantity - quantity,
            })
          );
        }
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
      removeCoupon();

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
  }, [user, jwt, saveCartToBackend, removeCoupon]);

  const modalInitialAddress = useMemo(
    () => (userProfile ? profileToCheckoutAddress(userProfile) : undefined),
    [userProfile, profileRevision]
  );

  const handleAddressSave = useCallback(async (address: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  }) => {
    await saveAddressToBackend(address);

    // After saving address, add the pending cart item if exists
    if (pendingCartItem) {
      await addToCartDirectly(pendingCartItem);
      setPendingCartItem(null);
    }
  }, [saveAddressToBackend, pendingCartItem, addToCartDirectly]);

  const showCheckoutOTP = useCallback(() => {
    setPendingCartItem(null); // No pending item, just for checkout
    setIsCartOpen(false); // Close cart drawer when OTP modal opens
    setShowOTPModal(true);
  }, []);

  const value = useMemo<CartContextType>(() => ({
    items,
    totalItems,
    totalPrice,
    isLoading,
    isCartOpen,
    setIsCartOpen,
    showCheckoutOTP,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    syncCart,
    couponCode,
    setCouponCode,
    couponError,
    couponSuccess,
    discount,
    appliedCoupon,
    verifyCoupon,
    removeCoupon,
    couponVerifying,
  }), [
    items,
    totalItems,
    totalPrice,
    isLoading,
    isCartOpen,
    showCheckoutOTP,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    syncCart,
    couponCode,
    couponError,
    couponSuccess,
    discount,
    appliedCoupon,
    verifyCoupon,
    removeCoupon,
    couponVerifying,
  ]);

  return (
    <CartContext.Provider value={value}>
      {children}
      <PhoneOTPModal
        isOpen={showOTPModal}
        onClose={() => {
          setShowOTPModal(false);
          setPendingCartItem(null);
        }}
        onSuccess={handleOTPSuccess}
      />
      <AddressModal
        isOpen={showAddressModal}
        onClose={() => {
          setShowAddressModal(false);
          setPendingCartItem(null);
        }}
        onSave={handleAddressSave}
        initialPhone={userPhone}
        initialAddress={modalInitialAddress}
      />
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

'use client'
import { useCart } from "@/app/context/CartContext";
import CartDrawer from "./CartDrawer";
import CartFloatingBar from "./CartFloatingBar";

export default function CartDrawerWrapper() {
  const { isCartOpen, setIsCartOpen } = useCart();
  return (
    <>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <CartFloatingBar />
    </>
  );
}


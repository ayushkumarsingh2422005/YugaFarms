"use client";

import { useCart } from "@/app/context/CartContext";
import Image from "next/image";
import { usePathname } from "next/navigation";

const HIDE_ON_PREFIXES = ["/cart", "/checkout"];

export default function CartFloatingBar() {
  const pathname = usePathname();
  const { items, totalItems, totalPrice, discount, isCartOpen, setIsCartOpen } =
    useCart();

  const hiddenRoute = HIDE_ON_PREFIXES.some((p) => pathname?.startsWith(p));
  const onProductPage = pathname?.startsWith("/product/");
  if (hiddenRoute || totalItems === 0 || isCartOpen) return null;

  const finalTotal = Math.max(0, totalPrice - discount);
  const preview = items.slice(0, 3);
  const itemLabel = totalItems === 1 ? "1 item" : `${totalItems} items`;

  return (
    <div
      className={`fixed left-1/2 z-[90] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 pb-[env(safe-area-inset-bottom)] pointer-events-none ${
        onProductPage ? "bottom-36 md:bottom-4" : "bottom-4"
      }`}
      aria-live="polite"
    >
      <button
        type="button"
        onClick={() => setIsCartOpen(true)}
        className="pointer-events-auto flex w-full items-center gap-3 rounded-full bg-[#4b2e19] px-3 py-2.5 text-white shadow-[0_8px_32px_rgba(75,46,25,0.35)] ring-2 ring-[#4b2e19]/20 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5d26a] focus-visible:ring-offset-2"
        aria-label={`View cart, ${itemLabel}, ₹${finalTotal.toFixed(0)}`}
      >
        <div className="flex shrink-0 items-center -space-x-2">
          {preview.map((item, i) => (
            <div
              key={`${item.productId}-${item.variantId}`}
              className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-[#4b2e19] bg-white"
              style={{ zIndex: preview.length - i }}
            >
              {item.productImage ? (
                <Image
                  src={item.productImage}
                  alt=""
                  fill
                  sizes="36px"
                  className="object-cover"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-[10px] font-semibold text-[#4b2e19]">
                  {item.productTitle.charAt(0)}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="min-w-0 flex-1 text-left">
          <p className="text-sm font-semibold leading-tight">{itemLabel}</p>
          <p className="text-base font-bold leading-tight">
            ₹{finalTotal.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </p>
        </div>

        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f5d26a] text-[#4b2e19]">
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </span>
      </button>
    </div>
  );
}

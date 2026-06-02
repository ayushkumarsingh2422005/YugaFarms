"use client";

import { useId } from "react";
import { useCart } from "@/app/context/CartContext";

type CouponApplyBlockProps = {
  variant?: "drawer" | "page" | "checkout";
  className?: string;
};

export default function CouponApplyBlock({
  variant = "checkout",
  className = "",
}: CouponApplyBlockProps) {
  const uid = useId();
  const {
    couponCode,
    setCouponCode,
    couponError,
    couponSuccess,
    discount,
    appliedCoupon,
    verifyCoupon,
    removeCoupon,
    couponVerifying,
    totalPrice,
  } = useCart();

  const isDrawer = variant === "drawer";
  const inputId = `${uid}-coupon`;

  return (
    <div className={className}>
      <label
        htmlFor={inputId}
        className={`block font-semibold text-[#4b2e19] ${isDrawer ? "text-xs mb-1" : "text-sm mb-2"}`}
      >
        Have a coupon?
      </label>
      {!isDrawer && (
        <p className="text-xs text-[#2D2D2D]/70 mb-3">
          {variant === "checkout"
            ? "Enter your coupon code below."
            : "Apply a code — it stays saved for checkout."}
        </p>
      )}
      <div className={`flex gap-1.5 ${isDrawer ? "md:gap-2" : "gap-2"}`}>
        <input
          id={inputId}
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
          placeholder="Coupon code"
          disabled={couponVerifying}
          className={`flex-1 border border-[#4b2e19]/20 rounded-md focus:outline-none focus:ring-2 focus:ring-[#f5d26a]/50 disabled:opacity-60 ${
            isDrawer
              ? "px-2 py-1.5 text-xs min-w-0"
              : "rounded-lg px-3 py-2.5 text-sm"
          }`}
        />
        <button
          type="button"
          onClick={() => verifyCoupon()}
          disabled={couponVerifying || totalPrice <= 0}
          className={`bg-[#4b2e19] text-white rounded-md font-semibold hover:bg-[#2f4f2f] transition-colors disabled:opacity-50 shrink-0 ${
            isDrawer ? "px-3 py-1.5 text-xs" : "rounded-lg px-4 py-2.5 text-sm"
          }`}
        >
          {couponVerifying ? "…" : "Apply"}
        </button>
      </div>
      {appliedCoupon && discount > 0 && (
        <div className={isDrawer ? "mt-1.5" : "mt-3"}>
          <button
            type="button"
            onClick={removeCoupon}
            className={`font-medium text-red-600 hover:text-red-800 ${isDrawer ? "text-[10px]" : "text-xs"}`}
          >
            Remove coupon
          </button>
        </div>
      )}
      {couponError && (
        <p className={`text-red-500 ${isDrawer ? "text-[10px] mt-1 leading-tight" : "text-xs mt-2"}`}>{couponError}</p>
      )}
      {couponSuccess && (
        <p
          className={`text-green-600 ${isDrawer ? "text-[10px] mt-1 leading-tight line-clamp-2" : "text-xs mt-2"}`}
        >
          {couponSuccess}
        </p>
      )}
    </div>
  );
}

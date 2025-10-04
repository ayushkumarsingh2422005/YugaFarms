'use client'
import React, { useEffect, useState } from "react";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:1337";

export default function CartPage() {
  const { items, totalItems, totalPrice, isLoading, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (productId: number, variantId: number, newQuantity: number) => {
    if (newQuantity < 0) return;
    
    try {
      setIsUpdating(true);
      await updateQuantity(productId, variantId, newQuantity);
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveItem = async (productId: number, variantId: number) => {
    try {
      setIsUpdating(true);
      await removeFromCart(productId, variantId);
    } catch (error) {
      console.error("Error removing item:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      try {
        setIsUpdating(true);
        await clearCart();
      } catch (error) {
        console.error("Error clearing cart:", error);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  if (isLoading) {
    return (
      <>
        <TopBar />
        <main className="min-h-screen bg-gradient-to-br from-[#fdf7f2] via-[#f8f4e6] to-[#f0e6d2] relative overflow-hidden pt-20">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4b2e19] mx-auto mb-4"></div>
              <p className="text-[#4b2e19] text-lg">Loading your cart...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (items.length === 0) {
    return (
      <>
        <TopBar />
        <main className="min-h-screen bg-gradient-to-br from-[#fdf7f2] via-[#f8f4e6] to-[#f0e6d2] relative overflow-hidden pt-20">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <div className="text-8xl mb-6">🛒</div>
              <h1 className="text-4xl md:text-5xl font-[Pacifico] text-[#4b2e19] mb-4">Your Cart is Empty</h1>
              <p className="text-lg text-[#2D2D2D]/70 mb-8 max-w-md mx-auto">
                Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/ghee" 
                  className="bg-[#4b2e19] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#2f4f2f] transition-colors duration-300 shadow-lg hover:shadow-xl"
                >
                  Shop Ghee
                </Link>
                <Link 
                  href="/honey" 
                  className="bg-[#f5d26a] text-[#4b2e19] px-8 py-3 rounded-xl font-semibold hover:bg-[#e6b800] transition-colors duration-300 shadow-lg hover:shadow-xl"
                >
                  Shop Honey
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <TopBar />
      <main className="min-h-screen bg-gradient-to-br from-[#fdf7f2] via-[#f8f4e6] to-[#f0e6d2] relative overflow-hidden pt-20">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-[Pacifico] text-[#4b2e19] mb-4">Your Cart</h1>
            <p className="text-lg text-[#2D2D2D]/70">
              {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <div key={`${item.productId}-${item.variantId}`} className="bg-white rounded-2xl border border-[#4b2e19]/15 shadow-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Product Image */}
                      <div className="md:w-32 md:h-32 w-full h-48 bg-gradient-to-br from-[#f5d26a] to-[#e6b800] rounded-xl flex items-center justify-center overflow-hidden">
                        {item.productImage ? (
                          <img 
                            src={item.productImage} 
                            alt={item.productTitle}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-6xl">🛒</span>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className="text-xl font-bold text-[#4b2e19] mb-1">{item.productTitle}</h3>
                          <p className="text-[#2D2D2D]/70 text-sm">Size: {item.weight}g</p>
                          <p className="text-[#2D2D2D]/60 text-xs">Variant ID: {item.variantId}</p>
                        </div>

                        {/* Price and Quantity Controls */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <span className="text-2xl font-bold text-[#4b2e19]">₹{item.price}</span>
                            <span className="text-sm text-[#2D2D2D]/70">per item</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleQuantityChange(item.productId, item.variantId, item.quantity - 1)}
                              disabled={isUpdating}
                              className="w-8 h-8 rounded-full border-2 border-[#4b2e19] text-[#4b2e19] flex items-center justify-center hover:bg-[#4b2e19] hover:text-white transition-colors duration-300 disabled:opacity-50"
                            >
                              -
                            </button>
                            <span className="w-12 text-center font-semibold text-[#4b2e19]">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item.productId, item.variantId, item.quantity + 1)}
                              disabled={isUpdating}
                              className="w-8 h-8 rounded-full border-2 border-[#4b2e19] text-[#4b2e19] flex items-center justify-center hover:bg-[#4b2e19] hover:text-white transition-colors duration-300 disabled:opacity-50"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Item Total */}
                        <div className="flex items-center justify-between pt-4 border-t border-[#4b2e19]/10">
                          <span className="text-lg font-semibold text-[#4b2e19]">
                            Total: ₹{item.price * item.quantity}
                          </span>
                          <button
                            onClick={() => handleRemoveItem(item.productId, item.variantId)}
                            disabled={isUpdating}
                            className="text-red-600 hover:text-red-800 transition-colors duration-300 disabled:opacity-50"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear Cart Button */}
              <div className="text-center">
                <button
                  onClick={handleClearCart}
                  disabled={isUpdating}
                  className="text-red-600 hover:text-red-800 transition-colors duration-300 disabled:opacity-50"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-[#4b2e19]/15 shadow-lg p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-[#4b2e19] mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-[#2D2D2D]/70">Items ({totalItems})</span>
                    <span className="font-semibold">₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#2D2D2D]/70">Shipping</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#2D2D2D]/70">Tax</span>
                    <span className="font-semibold">₹{Math.round(totalPrice * 0.18)}</span>
                  </div>
                  <div className="border-t border-[#4b2e19]/10 pt-4">
                    <div className="flex justify-between">
                      <span className="text-xl font-bold text-[#4b2e19]">Total</span>
                      <span className="text-xl font-bold text-[#4b2e19]">₹{totalPrice + Math.round(totalPrice * 0.18)}</span>
                    </div>
                  </div>
                </div>

                {user ? (
                  <Link 
                    href="/checkout"
                    className="block w-full bg-[#4b2e19] text-white py-4 rounded-xl font-semibold hover:bg-[#2f4f2f] transition-colors duration-300 shadow-lg hover:shadow-xl text-center"
                  >
                    Proceed to Checkout
                  </Link>
                ) : (
                  <div className="space-y-3">
                    <Link 
                      href="/login" 
                      className="block w-full bg-[#4b2e19] text-white py-4 rounded-xl font-semibold hover:bg-[#2f4f2f] transition-colors duration-300 shadow-lg hover:shadow-xl text-center"
                    >
                      Login to Checkout
                    </Link>
                    <p className="text-sm text-[#2D2D2D]/70 text-center">
                      You need to be logged in to proceed with checkout
                    </p>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-[#4b2e19]/10">
                  <div className="flex items-center gap-2 text-sm text-[#2D2D2D]/70">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Free shipping on orders above ₹699
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

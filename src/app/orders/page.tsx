'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import { parseApiErrorMessage, messageFromError } from "@/lib/authSession";
import { useRequireAuth } from "@/hooks/useRequireAuth";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:1337";

type OrderItem = {
  productId: number;
  variantId: number;
  quantity: number;
  price: number;
  weight: number;
  productTitle: string;
  productImage?: string;
};

type Address = {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
};

type Order = {
  id: number;
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  paymentMethod: 'COD' | 'RAZORPAY';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  orderStatus: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  notes?: string;
  createdAt: string;
};

export default function OrdersPage() {
  const { jwt, isLoading, isAuthed, handleAuthFailure } = useRequireAuth("/orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthed) return;
    void fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jwt, isAuthed]);

  const fetchOrders = async () => {
    if (!jwt) return;

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${BACKEND}/api/orders`, {
        headers: {
          'Authorization': `Bearer ${jwt}`
        }
      });
      
      if (!response.ok) {
        const message = await parseApiErrorMessage(response, "Failed to fetch orders");
        if (handleAuthFailure(response.status, message)) return;
        throw new Error(message);
      }
      
      const data = await response.json();
      setOrders(data.data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      const message = messageFromError(err, "Failed to load orders");
      if (handleAuthFailure(undefined, message)) return;
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'text-green-700 bg-green-50 border border-green-200/80';
      case 'PENDING': return 'text-amber-800 bg-amber-50 border border-amber-200/80';
      case 'FAILED': return 'text-red-700 bg-red-50 border border-red-200/80';
      default: return 'text-[#2D2D2D]/70 bg-[#f5f5f5] border border-gray-200/80';
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'text-sky-800 bg-sky-50 border border-sky-200/80';
      case 'PROCESSING': return 'text-violet-800 bg-violet-50 border border-violet-200/80';
      case 'SHIPPED': return 'text-indigo-800 bg-indigo-50 border border-indigo-200/80';
      case 'DELIVERED': return 'text-green-800 bg-green-50 border border-green-200/80';
      case 'CANCELLED': return 'text-red-800 bg-red-50 border border-red-200/80';
      default: return 'text-amber-800 bg-amber-50 border border-amber-200/80';
    }
  };

  const orderStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      PENDING: 'Pending',
      CONFIRMED: 'Confirmed',
      PROCESSING: 'Processing',
      SHIPPED: 'Shipped',
      DELIVERED: 'Delivered',
      CANCELLED: 'Cancelled',
    };
    return map[status] ?? status;
  };

  const paymentLabel = (status: string) => {
    if (status === 'PAID') return 'Paid';
    if (status === 'PENDING') return 'Payment pending';
    if (status === 'FAILED') return 'Failed';
    return status;
  };

  const formatWeight = (title: string, weight: number): string => {
    const isGhee = title.toLowerCase().includes('ghee');
    if (isGhee) {
      if (weight >= 1000) {
        const liters = weight / 1000;
        return liters % 1 === 0 ? `${liters} L` : `${liters.toFixed(1)} L`;
      }
      return `${weight} ml`;
    } else {
      if (weight >= 1000) {
        const kg = weight / 1000;
        return kg % 1 === 0 ? `${kg} kg` : `${kg.toFixed(1)} kg`;
      }
      return `${weight} g`;
    }
  };

  if (isLoading || (loading && !error)) {
    return (
      <>
        <TopBar />
        <main className="min-h-screen bg-gradient-to-br from-[#fdf7f2] via-[#f8f4e6] to-[#f0e6d2] relative overflow-hidden pt-6 md:pt-10">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4b2e19] mx-auto mb-4"></div>
              <p className="text-[#4b2e19] text-lg">Loading your orders...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <TopBar />
        <main className="min-h-screen bg-gradient-to-br from-[#fdf7f2] via-[#f8f4e6] to-[#f0e6d2] relative overflow-hidden pt-6 md:pt-10">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <p className="text-red-600 text-lg mb-4">Error: {error}</p>
              <button 
                onClick={fetchOrders}
                className="bg-[#4b2e19] text-white px-6 py-2 rounded-lg hover:bg-[#2f4f2f] transition-colors"
              >
                Try Again
              </button>
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
      <main className="min-h-screen bg-gradient-to-br from-[#fdf7f2] via-[#f8f4e6] to-[#f0e6d2] relative overflow-hidden pt-6 md:pt-10">
        <div className="container mx-auto px-3 sm:px-4 py-4 md:py-8 max-w-3xl lg:max-w-4xl">
          <div className="mb-4 md:mb-6">
            <h1 className="text-2xl md:text-4xl font-[Pacifico] text-[#4b2e19]">My orders</h1>
            <p className="text-sm text-[#2D2D2D]/70 mt-0.5">
              {orders.length === 0 ? 'Your purchases will show up here' : `${orders.length} order${orders.length === 1 ? '' : 's'}`}
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-10 md:py-14 bg-white/80 rounded-xl border border-[#4b2e19]/10 px-4">
              <div className="text-5xl md:text-6xl mb-3">📦</div>
              <h2 className="text-lg md:text-xl font-bold text-[#4b2e19] mb-2">No orders yet</h2>
              <p className="text-sm text-[#2D2D2D]/70 mb-6 max-w-sm mx-auto">
                When you buy something, you&apos;ll see it here with tracking and receipt.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center max-w-xs mx-auto sm:max-w-none">
                <Link
                  href="/ghee"
                  className="bg-[#4b2e19] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#2f4f2f] transition-colors"
                >
                  Shop ghee
                </Link>
                <Link
                  href="/honey"
                  className="bg-[#f5d26a] text-[#4b2e19] px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#e6b800] transition-colors"
                >
                  Shop honey
                </Link>
              </div>
            </div>
          ) : (
            <ul className="space-y-3 md:space-y-4">
              {orders.map((order) => (
                <li key={order.id}>
                  <article className="bg-white rounded-xl border border-[#4b2e19]/12 shadow-sm overflow-hidden">
                    {/* Top: meta + total + CTA */}
                    <div className="px-3 py-3 md:px-4 md:py-3.5 border-b border-[#4b2e19]/8 bg-[#fdf7f2]/40">
                      <div className="flex flex-wrap items-start justify-between gap-2 gap-y-1">
                        <div className="min-w-0">
                          <p className="font-semibold text-[#4b2e19] text-sm md:text-base truncate">
                            #{order.orderNumber}
                          </p>
                          <p className="text-[11px] md:text-xs text-[#2D2D2D]/65">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                            <span className="hidden sm:inline">
                              {' · '}
                              {new Date(order.createdAt).toLocaleTimeString('en-IN', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[10px] uppercase tracking-wide text-[#2D2D2D]/50">Total</p>
                          <p className="text-base md:text-lg font-bold text-[#4b2e19]">₹{Number(order.total).toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] md:text-xs font-medium ${getOrderStatusColor(order.orderStatus)}`}>
                          {orderStatusLabel(order.orderStatus)}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] md:text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                          {paymentLabel(order.paymentStatus)}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] md:text-xs font-medium bg-[#4b2e19]/8 text-[#4b2e19] border border-[#4b2e19]/15">
                          {order.paymentMethod === 'COD' ? 'COD' : 'Online'}
                        </span>
                      </div>
                    </div>

                    {/* Line items — compact */}
                    <div className="px-3 py-2 md:px-4 md:py-2.5 divide-y divide-[#4b2e19]/6">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-2.5 py-2 first:pt-0 last:pb-0">
                          <div className="w-9 h-9 md:w-10 md:h-10 shrink-0 bg-gradient-to-br from-[#f5d26a] to-[#e6b800] rounded-md overflow-hidden flex items-center justify-center">
                            {item.productImage ? (
                              <Image
                                src={item.productImage}
                                alt={item.productTitle}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-sm">🛒</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs md:text-sm font-medium text-[#2D2D2D] line-clamp-2 leading-snug">
                              {item.productTitle}
                            </p>
                            <p className="text-[10px] md:text-xs text-[#2D2D2D]/55">
                              {formatWeight(item.productTitle, item.weight)} × {item.quantity}
                            </p>
                          </div>
                          <p className="text-xs md:text-sm font-semibold text-[#4b2e19] shrink-0 tabular-nums">
                            ₹{item.price * item.quantity}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Ship + action */}
                    <div className="px-3 py-2.5 md:px-4 md:py-3 bg-[#f8f4e6]/25 border-t border-[#4b2e19]/8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <p className="text-[11px] md:text-xs text-[#2D2D2D]/70 min-w-0">
                        <span className="text-[#2D2D2D]/50">Ship to · </span>
                        {order.shippingAddress.city}, {order.shippingAddress.state}
                      </p>
                      <Link
                        href={`/order-success/${order.id}`}
                        className="shrink-0 inline-flex justify-center items-center bg-[#4b2e19] text-white px-4 py-2 rounded-lg text-xs md:text-sm font-semibold hover:bg-[#2f4f2f] transition-colors w-full sm:w-auto"
                      >
                        View receipt
                      </Link>
                    </div>
                    {order.notes && (
                      <p className="px-3 py-2 md:px-4 text-[11px] text-[#2D2D2D]/65 border-t border-[#4b2e19]/6 bg-white">
                        <span className="font-medium text-[#2D2D2D]/80">Note: </span>
                        {order.notes}
                      </p>
                    )}
                  </article>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

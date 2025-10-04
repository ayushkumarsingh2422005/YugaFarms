'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import { useAuth } from "@/app/context/AuthContext";

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

export default function OrderSuccessPage() {
  const params = useParams();
  const { user, jwt } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        // Use test endpoint for now (no authentication required)
        const response = await fetch(`${BACKEND}/api/test-orders/${params.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch order');
        }
        
        const data = await response.json();
        setOrder(data.data);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError(err instanceof Error ? err.message : 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchOrder();
    }
  }, [params.id, jwt]);

  if (loading) {
    return (
      <>
        <TopBar />
        <main className="min-h-screen bg-gradient-to-br from-[#fdf7f2] via-[#f8f4e6] to-[#f0e6d2] relative overflow-hidden pt-20">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4b2e19] mx-auto mb-4"></div>
              <p className="text-[#4b2e19] text-lg">Loading order details...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <TopBar />
        <main className="min-h-screen bg-gradient-to-br from-[#fdf7f2] via-[#f8f4e6] to-[#f0e6d2] relative overflow-hidden pt-20">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <p className="text-red-600 text-lg mb-4">Error: {error || 'Order not found'}</p>
              <Link 
                href="/"
                className="bg-[#4b2e19] text-white px-6 py-2 rounded-lg hover:bg-[#2f4f2f] transition-colors"
              >
                Go Home
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'text-green-600 bg-green-100';
      case 'PENDING': return 'text-yellow-600 bg-yellow-100';
      case 'FAILED': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'text-blue-600 bg-blue-100';
      case 'PROCESSING': return 'text-purple-600 bg-purple-100';
      case 'SHIPPED': return 'text-indigo-600 bg-indigo-100';
      case 'DELIVERED': return 'text-green-600 bg-green-100';
      case 'CANCELLED': return 'text-red-600 bg-red-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  return (
    <>
      <TopBar />
      <main className="min-h-screen bg-gradient-to-br from-[#fdf7f2] via-[#f8f4e6] to-[#f0e6d2] relative overflow-hidden pt-20">
        <div className="container mx-auto px-4 py-16">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="text-8xl mb-6">🎉</div>
            <h1 className="text-4xl md:text-5xl font-[Pacifico] text-[#4b2e19] mb-4">
              Order Placed Successfully!
            </h1>
            <p className="text-lg text-[#2D2D2D]/70 mb-2">
              Thank you for your order. We'll send you a confirmation email shortly.
            </p>
            <p className="text-sm text-[#2D2D2D]/60">
              Order Number: <span className="font-semibold text-[#4b2e19]">{order.orderNumber}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Status */}
              <div className="bg-white rounded-2xl border border-[#4b2e19]/15 shadow-lg p-6">
                <h2 className="text-2xl font-bold text-[#4b2e19] mb-4">Order Status</h2>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#2D2D2D]/70">Payment:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#2D2D2D]/70">Order:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getOrderStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#2D2D2D]/70">Method:</span>
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-[#4b2e19]/10 text-[#4b2e19]">
                      {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-2xl border border-[#4b2e19]/15 shadow-lg p-6">
                <h2 className="text-2xl font-bold text-[#4b2e19] mb-4">Order Items</h2>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-[#f8f4e6]/50 rounded-xl">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#f5d26a] to-[#e6b800] rounded-lg flex items-center justify-center overflow-hidden">
                        {item.productImage ? (
                          <img 
                            src={item.productImage} 
                            alt={item.productTitle}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl">🛒</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#4b2e19]">{item.productTitle}</h3>
                        <p className="text-sm text-[#2D2D2D]/70">{item.weight}g × {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#4b2e19]">₹{item.price * item.quantity}</p>
                        <p className="text-sm text-[#2D2D2D]/70">₹{item.price} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-2xl border border-[#4b2e19]/15 shadow-lg p-6">
                <h2 className="text-2xl font-bold text-[#4b2e19] mb-4">Shipping Address</h2>
                <div className="space-y-2">
                  <p className="font-semibold text-[#2D2D2D]">{order.shippingAddress.fullName}</p>
                  <p className="text-[#2D2D2D]/70">{order.shippingAddress.phone}</p>
                  <p className="text-[#2D2D2D]/70">{order.shippingAddress.addressLine1}</p>
                  {order.shippingAddress.addressLine2 && (
                    <p className="text-[#2D2D2D]/70">{order.shippingAddress.addressLine2}</p>
                  )}
                  <p className="text-[#2D2D2D]/70">
                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                  </p>
                  {order.shippingAddress.landmark && (
                    <p className="text-[#2D2D2D]/70">Landmark: {order.shippingAddress.landmark}</p>
                  )}
                </div>
              </div>

              {/* Order Notes */}
              {order.notes && (
                <div className="bg-white rounded-2xl border border-[#4b2e19]/15 shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-[#4b2e19] mb-4">Order Notes</h2>
                  <p className="text-[#2D2D2D]/70">{order.notes}</p>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-[#4b2e19]/15 shadow-lg p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-[#4b2e19] mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-[#2D2D2D]/70">Subtotal</span>
                    <span className="font-semibold">₹{order.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#2D2D2D]/70">Tax (18%)</span>
                    <span className="font-semibold">₹{order.tax}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#2D2D2D]/70">Shipping</span>
                    <span className="font-semibold text-green-600">
                      {order.shipping === 0 ? 'Free' : `₹${order.shipping}`}
                    </span>
                  </div>
                  <div className="border-t border-[#4b2e19]/10 pt-4">
                    <div className="flex justify-between">
                      <span className="text-xl font-bold text-[#4b2e19]">Total</span>
                      <span className="text-xl font-bold text-[#4b2e19]">₹{order.total}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link 
                    href="/orders"
                    className="block w-full bg-[#4b2e19] text-white py-3 rounded-xl font-semibold hover:bg-[#2f4f2f] transition-colors duration-300 shadow-lg hover:shadow-xl text-center"
                  >
                    View All Orders
                  </Link>
                  <Link 
                    href="/ghee"
                    className="block w-full border-2 border-[#4b2e19] text-[#4b2e19] py-3 rounded-xl font-semibold hover:bg-[#4b2e19] hover:text-white transition-colors duration-300 text-center"
                  >
                    Continue Shopping
                  </Link>
                </div>

                <div className="mt-6 pt-6 border-t border-[#4b2e19]/10">
                  <div className="text-center">
                    <p className="text-sm text-[#2D2D2D]/70 mb-2">Need help with your order?</p>
                    <p className="text-sm text-[#4b2e19] font-semibold">Contact us at support@yugafarms.com</p>
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

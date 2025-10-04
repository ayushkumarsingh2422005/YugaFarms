'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

export default function OrdersPage() {
  const router = useRouter();
  const { user, jwt } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // For testing, allow access without authentication
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Use test endpoint for now (no authentication required)
      const response = await fetch(`${BACKEND}/api/test-orders`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      setOrders(data.data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

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

  const getOrderStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return '⏳';
      case 'CONFIRMED': return '✅';
      case 'PROCESSING': return '🔄';
      case 'SHIPPED': return '🚚';
      case 'DELIVERED': return '📦';
      case 'CANCELLED': return '❌';
      default: return '❓';
    }
  };

  const canCancelOrder = (order: Order) => {
    return order.orderStatus === 'PENDING' || order.orderStatus === 'CONFIRMED';
  };

  const handleCancelOrder = async (orderId: number) => {
    if (!confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${BACKEND}/api/test-orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to cancel order');
      }

      const result = await response.json();
      alert(result.message || 'Order cancelled successfully');
      
      // Refresh orders list
      fetchOrders();
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert(error instanceof Error ? error.message : 'Failed to cancel order');
    }
  };

  if (loading) {
    return (
      <>
        <TopBar />
        <main className="min-h-screen bg-gradient-to-br from-[#fdf7f2] via-[#f8f4e6] to-[#f0e6d2] relative overflow-hidden pt-20">
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
        <main className="min-h-screen bg-gradient-to-br from-[#fdf7f2] via-[#f8f4e6] to-[#f0e6d2] relative overflow-hidden pt-20">
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
      <main className="min-h-screen bg-gradient-to-br from-[#fdf7f2] via-[#f8f4e6] to-[#f0e6d2] relative overflow-hidden pt-20">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-[Pacifico] text-[#4b2e19] mb-4">My Orders</h1>
            <p className="text-lg text-[#2D2D2D]/70">
              Track and manage your orders
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-8xl mb-6">📦</div>
              <h2 className="text-3xl font-bold text-[#4b2e19] mb-4">No Orders Yet</h2>
              <p className="text-lg text-[#2D2D2D]/70 mb-8 max-w-md mx-auto">
                You haven't placed any orders yet. Start shopping to see your orders here!
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
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl border border-[#4b2e19]/15 shadow-lg overflow-hidden">
                  {/* Order Header */}
                  <div className="p-6 border-b border-[#4b2e19]/10">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-[#4b2e19]">Order #{order.orderNumber}</h3>
                        <p className="text-sm text-[#2D2D2D]/70">
                          Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}>
                          Payment: {order.paymentStatus}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getOrderStatusColor(order.orderStatus)}`}>
                          {getOrderStatusIcon(order.orderStatus)} {order.orderStatus}
                        </span>
                        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-[#4b2e19]/10 text-[#4b2e19]">
                          {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <h4 className="text-lg font-semibold text-[#4b2e19] mb-4">Order Items</h4>
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 bg-[#f8f4e6]/50 rounded-xl">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#f5d26a] to-[#e6b800] rounded-lg flex items-center justify-center overflow-hidden">
                            {item.productImage ? (
                              <img 
                                src={item.productImage} 
                                alt={item.productTitle}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-lg">🛒</span>
                            )}
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-[#4b2e19]">{item.productTitle}</h5>
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

                  {/* Order Summary */}
                  <div className="p-6 bg-[#f8f4e6]/30 border-t border-[#4b2e19]/10">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-[#2D2D2D]/70">
                          <span className="font-medium">Shipping to:</span> {order.shippingAddress.city}, {order.shippingAddress.state}
                        </p>
                        {order.notes && (
                          <p className="text-sm text-[#2D2D2D]/70">
                            <span className="font-medium">Notes:</span> {order.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm text-[#2D2D2D]/70">Total Amount</p>
                          <p className="text-2xl font-bold text-[#4b2e19]">₹{order.total}</p>
                        </div>
                        <div className="flex gap-3">
                          <Link 
                            href={`/order-success/${order.id}`}
                            className="bg-[#4b2e19] text-white px-6 py-2 rounded-xl font-semibold hover:bg-[#2f4f2f] transition-colors duration-300 shadow-lg hover:shadow-xl"
                          >
                            View Details
                          </Link>
                          {canCancelOrder(order) && (
                            <button
                              onClick={() => handleCancelOrder(order.id)}
                              className="bg-red-500 text-white px-6 py-2 rounded-xl font-semibold hover:bg-red-600 transition-colors duration-300 shadow-lg hover:shadow-xl"
                            >
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

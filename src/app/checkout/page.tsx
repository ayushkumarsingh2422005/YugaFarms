'use client'
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import CouponApplyBlock from "@/components/CouponApplyBlock";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";
import {
  YGF_CHECKOUT_CONTACT_KEY,
  dispatchPixelContactUpdated,
} from "@/lib/metaAdvancedMatching";
import { trackBeginCheckout } from "@/lib/gtag";
import { buildEventProducts, trackCustomerEvent } from "@/lib/customerEvents";
import { notifyOrderPlaced } from "@/lib/waNotify";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:1337";

const fieldClass =
  "w-full border border-[#4b2e19]/20 rounded-lg md:rounded-xl px-3 py-2 md:px-4 md:py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#f5d26a]/50 focus:border-[#f5d26a]";

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

type PaymentMethod = 'COD' | 'RAZORPAY';

type RazorpayPaymentResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayPaymentFailedResponse = {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: {
      order_id: string;
      payment_id: string;
    };
  };
};

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayPaymentResponse) => void | Promise<void>;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color: string;
  };
}

interface RazorpayInstance {
  on: (event: string, handler: (response: RazorpayPaymentFailedResponse) => void) => void;
  open: () => void;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    totalPrice,
    clearCart,
    showCheckoutOTP,
    discount,
    appliedCoupon,
  } = useCart();
  const { user, jwt } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const checkoutTrackedRef = useRef(false);

  // Meta: InitiateCheckout · GA4: begin_checkout (once) · Strapi customer-event (once per tab, after JWT)
  useEffect(() => {
    if (items.length === 0 || typeof window === "undefined") return;

    const value = Math.max(0, totalPrice - discount);

    if (!checkoutTrackedRef.current) {
      if ((window as any).fbq) {
        (window as any).fbq('track', 'InitiateCheckout', {
          value: totalPrice,
          currency: 'INR',
          num_items: items.reduce((sum, item) => sum + item.quantity, 0),
          content_ids: items.map(item => item.productId.toString()),
          content_type: 'product'
        });
      }

      trackBeginCheckout(
        items,
        value,
        "INR",
        appliedCoupon?.Code
      );
      checkoutTrackedRef.current = true;
    }

    void trackCustomerEvent("checkout", {
      jwt,
      requireAuth: true,
      path: "/checkout",
      payload: {
        valueInr: value,
        itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
        products: buildEventProducts(items),
        couponCode: appliedCoupon?.Code ?? null,
      },
    });
  }, [items, totalPrice, discount, appliedCoupon, jwt]);

  // Track if OTP modal has been shown to prevent repeated displays
  const otpModalShownRef = useRef(false);

  // Show OTP modal if user is not logged in
  useEffect(() => {
    if (!user && items.length > 0 && !otpModalShownRef.current) {
      showCheckoutOTP();
      otpModalShownRef.current = true;
    }

    // Reset the flag if user logs out
    if (user) {
      otpModalShownRef.current = false;
    }
  }, [user, items.length, showCheckoutOTP]);

  // Address states
  const [shippingAddress, setShippingAddress] = useState<Address>({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    landmark: ''
  });

  const [billingAddress, setBillingAddress] = useState<Address>({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    landmark: ''
  });

  const [useSameAddress, setUseSameAddress] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('RAZORPAY');
  const [orderNotes, setOrderNotes] = useState('');

  // Calculate totals
  const tax = 0;
  const shipping = 0;
  const finalTotal = Math.max(0, totalPrice + tax + shipping - discount);

  const loadUserAddress = useCallback(async () => {
    if (!jwt) return;

    try {
      const response = await fetch(`${BACKEND}/api/users/me`, {
        headers: { Authorization: `Bearer ${jwt}` }
      });

      if (response.ok) {
        const userData = await response.json();
        if (userData.AddressLine1) {
          setShippingAddress({
            fullName: userData.username || '',
            phone: userData.Phone?.toString() || '',
            addressLine1: userData.AddressLine1 || '',
            addressLine2: userData.AddressLine2 || '',
            city: userData.City || '',
            state: userData.State || '',
            pincode: userData.Pin?.toString() || '',
            landmark: ''
          });
        }
      }
    } catch (error) {
      console.error('Error loading user address:', error);
    }
  }, [jwt]);

  useEffect(() => {
    // Redirect if cart is empty
    if (items.length === 0) {
      router.push('/cart');
      return;
    }

    // Load user's saved address if user is logged in
    if (user && jwt) {
      loadUserAddress();
    }
  }, [items, user, router, loadUserAddress, jwt]);

  // Meta Pixel advanced matching: sync checkout contact fields for fbq('init')
  useEffect(() => {
    const payload = {
      fullName: shippingAddress.fullName,
      phone: shippingAddress.phone,
      city: shippingAddress.city,
      state: shippingAddress.state,
      pincode: shippingAddress.pincode,
    };
    const hasAny = Object.values(payload).some(
      (v) => v != null && String(v).trim() !== ""
    );
    if (!hasAny) return;
    try {
      sessionStorage.setItem(YGF_CHECKOUT_CONTACT_KEY, JSON.stringify(payload));
      dispatchPixelContactUpdated();
    } catch {
      // ignore storage errors
    }
  }, [
    shippingAddress.fullName,
    shippingAddress.phone,
    shippingAddress.city,
    shippingAddress.state,
    shippingAddress.pincode,
  ]);

  const validateAddress = (address: Address): string[] => {
    const errors: string[] = [];

    if (!address.fullName.trim()) errors.push('Full name is required');
    if (!address.phone.trim()) errors.push('Phone number is required');
    if (!address.addressLine1.trim()) errors.push('Address line 1 is required');
    if (!address.city.trim()) errors.push('City is required');
    if (!address.state.trim()) errors.push('State is required');
    if (!address.pincode.trim()) errors.push('Pincode is required');

    // Phone validation - strip +91 and non-digits, then validate
    const cleanPhone = address.phone.replace(/\D/g, '').replace(/^91/, '');
    if (address.phone && !/^[6-9]\d{9}$/.test(cleanPhone)) {
      errors.push('Please enter a valid 10-digit phone number');
    }

    // Pincode validation
    if (address.pincode && !/^\d{6}$/.test(address.pincode)) {
      errors.push('Please enter a valid 6-digit pincode');
    }

    return errors;
  };

  const handleAddressSubmit = () => {
    const shippingErrors = validateAddress(shippingAddress);
    const billingErrors = useSameAddress ? [] : validateAddress(billingAddress);

    if (shippingErrors.length > 0 || billingErrors.length > 0) {
      alert('Please fix the following errors:\n' + [...shippingErrors, ...billingErrors].join('\n'));
      return;
    }

    setCurrentStep(2);
  };

  const handlePaymentSubmit = async () => {
    setIsLoading(true);

    try {
      if (paymentMethod === 'COD') {
        await createOrder();
      } else {
        void trackCustomerEvent("paymentbutton", {
          jwt,
          requireAuth: true,
          path: "/checkout",
          payload: {
            paymentMethod: "RAZORPAY",
            valueInr: finalTotal,
            itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
            products: buildEventProducts(items),
            couponCode: appliedCoupon?.Code ?? null,
          },
        });
        await initiateRazorpayPayment();
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const createOrder = async () => {
    if (!jwt) {
      throw new Error('You must be logged in to create an order');
    }

    // Clean phone numbers - ensure only 10 digits are saved (no +91 prefix)
    const cleanShippingPhone = shippingAddress.phone.replace(/\D/g, '').replace(/^91/, '').slice(0, 10);
    const cleanBillingPhone = useSameAddress
      ? cleanShippingPhone
      : billingAddress.phone.replace(/\D/g, '').replace(/^91/, '').slice(0, 10);

    const orderData = {
      items: items,
      shippingAddress: {
        ...shippingAddress,
        phone: cleanShippingPhone
      },
      billingAddress: useSameAddress
        ? { ...shippingAddress, phone: cleanShippingPhone }
        : { ...billingAddress, phone: cleanBillingPhone },
      subtotal: totalPrice,
      tax: tax,
      shipping: shipping,
      total: finalTotal,
      paymentMethod: paymentMethod,
      notes: orderNotes,
      user: user?.id,
      coupon: appliedCoupon?.id
    };

    const response = await fetch(`${BACKEND}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      },
      body: JSON.stringify({ data: orderData })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error?.error?.message || 'Failed to create order');
    }

    const order = await response.json();

    notifyOrderPlaced({
      strapiOrderId: order.data.id,
      orderNumber: order.data.orderNumber,
      total: finalTotal,
      phone: cleanShippingPhone,
      userId: user?.id,
      customerName: shippingAddress.fullName,
      items,
    });

    // Clear cart and redirect to success page
    await clearCart();
    router.push(`/order-success/${order.data.id}`);
  };

  const initiateRazorpayPayment = async () => {
    if (!jwt) {
      throw new Error('You must be logged in to create an order');
    }

    // Clean phone numbers - ensure only 10 digits are saved (no +91 prefix)
    const cleanShippingPhone = shippingAddress.phone.replace(/\D/g, '').replace(/^91/, '').slice(0, 10);
    const cleanBillingPhone = useSameAddress
      ? cleanShippingPhone
      : billingAddress.phone.replace(/\D/g, '').replace(/^91/, '').slice(0, 10);

    // Create order first
    const orderData = {
      items: items,
      shippingAddress: {
        ...shippingAddress,
        phone: cleanShippingPhone
      },
      billingAddress: useSameAddress
        ? { ...shippingAddress, phone: cleanShippingPhone }
        : { ...billingAddress, phone: cleanBillingPhone },
      subtotal: totalPrice,
      tax: tax,
      shipping: shipping,
      total: finalTotal,
      paymentMethod: paymentMethod,
      notes: orderNotes,
      user: user?.id,
      coupon: appliedCoupon?.id
    };

    const response = await fetch(`${BACKEND}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`
      },
      body: JSON.stringify({ data: orderData })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error?.error?.message || 'Failed to create order');
    }

    const order = await response.json();

    notifyOrderPlaced({
      strapiOrderId: order.data.id,
      orderNumber: order.data.orderNumber,
      total: finalTotal,
      phone: cleanShippingPhone,
      userId: user?.id,
      customerName: shippingAddress.fullName,
      items,
    });

    // Check if Razorpay is properly configured on frontend
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID === 'your_razorpay_key_id_here') {
      alert('Razorpay is not configured on the frontend. Please contact support.');
      return;
    }

    // Check if we have a valid Razorpay order ID from backend
    if (!order.data.razorpayOrderId) {
      alert('Razorpay order creation failed. Please try again or use COD.');
      return;
    }

    // Check if Razorpay script is loaded
    if (typeof window === 'undefined' || !window.Razorpay) {
      alert('Razorpay payment gateway is not loaded. Please refresh the page and try again.');
      return;
    }

    // Initialize Razorpay payment
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: Math.round(finalTotal * 100), // Amount in paise, rounded to integer
      currency: 'INR',
      name: 'YugaFarms',
      description: `Order #${order.data.orderNumber}`,
      order_id: order.data.razorpayOrderId,
      handler: async function (response: RazorpayPaymentResponse) {
        // Payment successful
        await handlePaymentSuccess(order.data.id, response);
      },
      prefill: {
        name: shippingAddress.fullName,
        email: user?.email,
        contact: shippingAddress.phone,
      },
      notes: {
        order_id: order.data.id,
        order_number: order.data.orderNumber
      },
      theme: {
        color: '#4b2e19'
      }
    };

    try {
      const razorpay = new window.Razorpay(options);

      razorpay.on('payment.failed', function (response: RazorpayPaymentFailedResponse) {
        console.error('Payment failed:', response.error);
        alert(`Payment failed: ${response.error.description || 'Please try again.'}`);
      });

      razorpay.open();
    } catch (error) {
      console.error('Razorpay initialization error:', error);
      alert('Payment gateway initialization failed. Please refresh the page and try again.');
    }
  };

  const handlePaymentSuccess = async (orderId: number, paymentResponse: RazorpayPaymentResponse) => {
    try {
      if (!jwt) {
        throw new Error('You must be logged in to confirm payment');
      }

      const response = await fetch(`${BACKEND}/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`
        },
        body: JSON.stringify({
          data: {
            paymentStatus: 'PAID',
            razorpayPaymentId: paymentResponse.razorpay_payment_id,
            razorpayOrderId: paymentResponse.razorpay_order_id,
            razorpaySignature: paymentResponse.razorpay_signature
          }
        })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error?.error?.message || 'Failed to confirm payment');
      }

      // Clear cart and redirect to success page
      await clearCart();
      router.push(`/order-success/${orderId}`);
    } catch (error) {
      console.error('Payment confirmation error:', error);
      alert(error instanceof Error ? error.message : 'Payment confirmation failed. Please contact support.');
    }
  };

  if (items.length === 0) {
    return (
      <>
        <TopBar />
        <main className="min-h-screen bg-gradient-to-br from-[#fdf7f2] via-[#f8f4e6] to-[#f0e6d2] relative overflow-hidden pt-6 md:pt-10">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4b2e19] mx-auto mb-4"></div>
              <p className="text-[#4b2e19] text-lg">Loading checkout...</p>
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
      <main className="min-h-screen bg-gradient-to-br from-[#fdf7f2] via-[#f8f4e6] to-[#f0e6d2] relative overflow-hidden pt-6 md:pt-10 pb-28 md:pb-10">
        <div className="container mx-auto px-3 sm:px-4 py-3 md:py-6 max-w-2xl lg:max-w-none">
          <div className="mb-4 md:mb-6">
            <h1 className="text-2xl md:text-4xl font-[Pacifico] text-[#4b2e19]">Checkout</h1>
            <p className="text-sm text-[#2D2D2D]/70 mt-1">
              Step {currentStep} of 2 · {currentStep === 1 ? 'Where should we deliver?' : 'How would you like to pay?'}
            </p>
          </div>

          <div className="flex items-center gap-2 mb-4 md:mb-6 text-xs md:text-sm font-medium">
            <span className="shrink-0">Delivery</span>
            <span
              className={`h-0.5 flex-1 max-w-[80px] rounded-full ${currentStep >= 2 ? 'bg-[#4b2e19]' : 'bg-[#4b2e19]/30'}`}
              aria-hidden
            />
            <span className={`shrink-0 ${currentStep >= 2 ? 'text-[#4b2e19]' : 'text-[#2D2D2D]/50'}`}>Payment</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
            {/* Summary: below form on mobile; sticky bar shows total + primary CTA */}
            <div className="lg:col-span-1 order-2 lg:order-2">
              <div className="bg-white rounded-xl md:rounded-2xl border border-[#4b2e19]/15 shadow-md lg:shadow-lg p-4 md:p-6 lg:sticky lg:top-24">
                <h2 className="text-base md:text-xl font-bold text-[#4b2e19] mb-3 md:mb-4">Your order</h2>

                <ul className="space-y-2 mb-3 max-h-[36vh] md:max-h-none overflow-y-auto overscroll-contain">
                  {items.map((item) => (
                    <li key={`${item.productId}-${item.variantId}`} className="flex justify-between gap-2 text-sm">
                      <span className="text-[#2D2D2D] line-clamp-2">
                        {item.productTitle}{' '}
                        <span className="text-[#2D2D2D]/60">×{item.quantity}</span>
                      </span>
                      <span className="font-semibold text-[#4b2e19] shrink-0">₹{item.price * item.quantity}</span>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-[#4b2e19]/10 pt-3 mb-3">
                  <CouponApplyBlock variant="checkout" />
                </div>

                <div className="border-t border-[#4b2e19]/10 pt-3 space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#2D2D2D]/70">Subtotal</span>
                    <span className="font-semibold">₹{totalPrice}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-700">
                      <span className="text-[#2D2D2D]/70">Discount</span>
                      <span className="font-semibold">-₹{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-1 border-t border-[#4b2e19]/10">
                    <span className="font-bold text-[#4b2e19]">Total</span>
                    <span className="font-bold text-lg text-[#4b2e19]">₹{finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main form — first on mobile */}
            <div className="lg:col-span-2 order-1 lg:order-1">
              {currentStep === 1 ? (
                <div className="bg-white rounded-xl md:rounded-2xl border border-[#4b2e19]/15 shadow-md md:shadow-lg p-4 md:p-8">
                  <h2 className="text-lg md:text-2xl font-bold text-[#4b2e19] mb-4 md:mb-6">Delivery details</h2>

                  <div className="space-y-4 md:space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                      <div>
                        <label className="block text-xs md:text-sm font-medium text-[#2D2D2D] mb-1">Full name</label>
                        <input
                          type="text"
                          value={shippingAddress.fullName}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                          className={fieldClass}
                          placeholder="Name on the order"
                          autoComplete="name"
                        />
                      </div>
                      <div>
                        <label className="block text-xs md:text-sm font-medium text-[#2D2D2D] mb-1">Mobile</label>
                        <div className="flex items-stretch border border-[#4b2e19]/20 rounded-lg md:rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#f5d26a]/50 focus-within:border-[#f5d26a]">
                          <span className="px-2.5 md:px-3 flex items-center bg-[#f5d26a]/15 text-[#4b2e19] text-xs md:text-sm font-semibold border-r border-[#4b2e19]/20">
                            +91
                          </span>
                          <input
                            type="tel"
                            inputMode="numeric"
                            value={shippingAddress.phone.replace(/\D/g, '').replace(/^91/, '')}
                            onChange={(e) => {
                              const digits = e.target.value.replace(/\D/g, '').replace(/^91/, '').slice(0, 10);
                              setShippingAddress({ ...shippingAddress, phone: digits });
                            }}
                            className="flex-1 min-w-0 px-2.5 md:px-3 py-2 md:py-2.5 text-sm focus:outline-none"
                            placeholder="10-digit number"
                            maxLength={10}
                            autoComplete="tel"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs md:text-sm font-medium text-[#2D2D2D] mb-1">Street & house no. *</label>
                      <input
                        type="text"
                        value={shippingAddress.addressLine1}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine1: e.target.value })}
                        className={fieldClass}
                        placeholder="House / flat, street"
                        autoComplete="street-address"
                      />
                    </div>

                    <div>
                      <label className="block text-xs md:text-sm font-medium text-[#2D2D2D] mb-1">Area (optional)</label>
                      <input
                        type="text"
                        value={shippingAddress.addressLine2}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine2: e.target.value })}
                        className={fieldClass}
                        placeholder="Locality, landmark"
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-xs md:text-sm font-medium text-[#2D2D2D] mb-1">City *</label>
                        <input
                          type="text"
                          value={shippingAddress.city}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                          className={fieldClass}
                          placeholder="City"
                          autoComplete="address-level2"
                        />
                      </div>
                      <div>
                        <label className="block text-xs md:text-sm font-medium text-[#2D2D2D] mb-1">State *</label>
                        <input
                          type="text"
                          value={shippingAddress.state}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                          className={fieldClass}
                          placeholder="State"
                          autoComplete="address-level1"
                        />
                      </div>
                      <div>
                        <label className="block text-xs md:text-sm font-medium text-[#2D2D2D] mb-1">PIN *</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={shippingAddress.pincode}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                          className={fieldClass}
                          placeholder="6 digits"
                          maxLength={6}
                          autoComplete="postal-code"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs md:text-sm font-medium text-[#2D2D2D] mb-1">Landmark (optional)</label>
                      <input
                        type="text"
                        value={shippingAddress.landmark}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, landmark: e.target.value })}
                        className={fieldClass}
                        placeholder="Helps our delivery partner"
                      />
                    </div>

                    <details className="group border border-[#4b2e19]/10 rounded-lg md:rounded-xl bg-[#fdf7f2]/50">
                      <summary className="cursor-pointer text-sm font-medium text-[#4b2e19] px-3 py-2.5 list-none flex items-center justify-between [&::-webkit-details-marker]:hidden">
                        <span>Delivery note (optional)</span>
                        <span className="text-[#2D2D2D]/50 text-xs group-open:rotate-180 transition-transform">▼</span>
                      </summary>
                      <div className="px-3 pb-3 pt-0">
                        <textarea
                          value={orderNotes}
                          onChange={(e) => setOrderNotes(e.target.value)}
                          rows={2}
                          className={`${fieldClass} resize-none`}
                          placeholder="Gate code, delivery time…"
                        />
                      </div>
                    </details>

                    {/* Billing Address */}
                    <div className="border-t border-[#4b2e19]/10 pt-4 md:pt-5">
                      <div className="flex items-center mb-4">
                        <input
                          type="checkbox"
                          id="sameAddress"
                          checked={useSameAddress}
                          onChange={(e) => setUseSameAddress(e.target.checked)}
                          className="w-4 h-4 text-[#4b2e19] border-[#4b2e19]/20 rounded focus:ring-[#f5d26a]/50"
                        />
                        <label htmlFor="sameAddress" className="ml-2 text-sm font-semibold text-[#2D2D2D]">
                          Use same address for billing
                        </label>
                      </div>

                      {!useSameAddress && (
                        <div className="space-y-4">
                          <h3 className="text-base font-bold text-[#4b2e19]">Billing address</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                            <div>
                              <label className="block text-xs md:text-sm font-medium text-[#2D2D2D] mb-1">Full name *</label>
                              <input
                                type="text"
                                value={billingAddress.fullName}
                                onChange={(e) => setBillingAddress({ ...billingAddress, fullName: e.target.value })}
                                className={fieldClass}
                                placeholder="Billing name"
                              />
                            </div>
                            <div>
                              <label className="block text-xs md:text-sm font-medium text-[#2D2D2D] mb-1">Mobile *</label>
                              <div className="flex items-stretch border border-[#4b2e19]/20 rounded-lg md:rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#f5d26a]/50 focus-within:border-[#f5d26a]">
                                <span className="px-2.5 md:px-3 flex items-center bg-[#f5d26a]/15 text-[#4b2e19] text-xs font-semibold border-r border-[#4b2e19]/20">
                                  +91
                                </span>
                                <input
                                  type="tel"
                                  inputMode="numeric"
                                  value={billingAddress.phone.replace(/\D/g, '').replace(/^91/, '')}
                                  onChange={(e) => {
                                    const digits = e.target.value.replace(/\D/g, '').replace(/^91/, '').slice(0, 10);
                                    setBillingAddress({ ...billingAddress, phone: digits });
                                  }}
                                  className="flex-1 min-w-0 px-2.5 py-2 text-sm focus:outline-none"
                                  placeholder="10-digit number"
                                  maxLength={10}
                                />
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-[#2D2D2D]/60">Add full billing address from your account if required for GST invoice.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="hidden lg:flex justify-end mt-6 md:mt-8">
                    <button
                      type="button"
                      onClick={handleAddressSubmit}
                      className="bg-[#4b2e19] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#2f4f2f] transition-colors shadow-lg"
                    >
                      Continue to payment
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl md:rounded-2xl border border-[#4b2e19]/15 shadow-md md:shadow-lg p-4 md:p-8">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="lg:hidden text-sm font-medium text-[#4b2e19] mb-3 flex items-center gap-1 hover:underline"
                  >
                    ← Edit delivery details
                  </button>
                  <h2 className="text-lg md:text-2xl font-bold text-[#4b2e19] mb-4 md:mb-6">Payment</h2>

                  <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                    <button
                      type="button"
                      className={`w-full text-left border-2 rounded-xl p-3 md:p-4 cursor-pointer transition-all ${paymentMethod === 'RAZORPAY' ? 'border-[#4b2e19] bg-[#4b2e19]/5' : 'border-[#4b2e19]/20 hover:border-[#4b2e19]/40'
                        }`}
                      onClick={() => setPaymentMethod('RAZORPAY')}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="payment"
                          value="RAZORPAY"
                          checked={paymentMethod === 'RAZORPAY'}
                          onChange={() => setPaymentMethod('RAZORPAY')}
                          className="w-4 h-4 mt-0.5 text-[#4b2e19] border-[#4b2e19]/20 shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-[#4b2e19] text-sm md:text-base">Pay online</p>
                          <p className="text-xs md:text-sm text-[#2D2D2D]/70">UPI, cards &amp; net banking via Razorpay</p>
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      className={`w-full text-left border-2 rounded-xl p-3 md:p-4 cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-[#4b2e19] bg-[#4b2e19]/5' : 'border-[#4b2e19]/20 hover:border-[#4b2e19]/40'
                        }`}
                      onClick={() => setPaymentMethod('COD')}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="payment"
                          value="COD"
                          checked={paymentMethod === 'COD'}
                          onChange={() => setPaymentMethod('COD')}
                          className="w-4 h-4 mt-0.5 text-[#4b2e19] border-[#4b2e19]/20 shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-[#4b2e19] text-sm md:text-base">Cash on delivery</p>
                          <p className="text-xs md:text-sm text-[#2D2D2D]/70">Pay when the order reaches you</p>
                        </div>
                      </div>
                    </button>
                  </div>

                  <div className="hidden lg:flex flex-wrap justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="border-2 border-[#4b2e19] text-[#4b2e19] px-6 py-2.5 rounded-xl font-semibold hover:bg-[#4b2e19] hover:text-white transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handlePaymentSubmit}
                      disabled={isLoading}
                      className="bg-[#4b2e19] text-white px-8 py-2.5 rounded-xl font-semibold hover:bg-[#2f4f2f] transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Processing...' : paymentMethod === 'COD' ? 'Place order' : 'Pay now'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile: fixed primary action — total always visible */}
        <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t border-[#4b2e19]/15 bg-[#fdf7f2]/95 backdrop-blur-md shadow-[0_-8px_30px_rgba(75,46,25,0.12)] px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <div className="flex items-center gap-3 max-w-lg mx-auto">
            <div className="min-w-0 shrink">
              <p className="text-[10px] uppercase tracking-wide text-[#2D2D2D]/60">Total</p>
              <p className="text-lg font-bold text-[#4b2e19] leading-tight">₹{finalTotal.toFixed(2)}</p>
            </div>
            {currentStep === 1 ? (
              <button
                type="button"
                onClick={handleAddressSubmit}
                className="flex-1 min-w-0 bg-[#4b2e19] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#2f4f2f] transition-colors shadow-md"
              >
                Continue to payment
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePaymentSubmit}
                disabled={isLoading}
                className="flex-1 min-w-0 bg-[#4b2e19] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#2f4f2f] transition-colors shadow-md disabled:opacity-50"
              >
                {isLoading ? 'Please wait…' : paymentMethod === 'COD' ? 'Place order' : `Pay ₹${finalTotal.toFixed(0)}`}
              </button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

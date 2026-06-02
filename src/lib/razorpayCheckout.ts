const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:1337";

export type RazorpayIntentResult = {
  razorpayOrderId: string;
  amount: number;
  currency: string;
  receiptRef?: string;
};

/** Start Razorpay checkout — tries dedicated route, then POST /api/orders fallback. */
export async function requestRazorpayIntent(
  jwt: string,
  orderData: Record<string, unknown>
): Promise<{ ok: true; intent: RazorpayIntentResult } | { ok: false; status: number; message: string }> {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwt}`,
  };

  let res = await fetch(`${BACKEND}/api/orders/razorpay-intent`, {
    method: "POST",
    headers,
    body: JSON.stringify({ data: { ...orderData, paymentMethod: "RAZORPAY" } }),
  });

  if (res.status === 404 || res.status === 405) {
    res = await fetch(`${BACKEND}/api/orders`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        data: { ...orderData, paymentMethod: "RAZORPAY", razorpayIntentOnly: true },
      }),
    });
  }

  if (!res.ok) {
    let message = "Failed to start payment";
    try {
      const err = (await res.json()) as {
        error?: { message?: string };
        message?: string;
      };
      message = err?.error?.message || err?.message || message;
    } catch {
      if (res.status === 405 || res.status === 404) {
        message =
          "Payment API is not available on the server yet. Please use Cash on Delivery or try again after the site is updated.";
      }
    }
    return { ok: false, status: res.status, message };
  }

  const intent = (await res.json()) as RazorpayIntentResult;
  if (!intent.razorpayOrderId) {
    return {
      ok: false,
      status: 500,
      message: "Razorpay order creation failed. Check server Razorpay keys or use COD.",
    };
  }

  return { ok: true, intent };
}

export async function confirmRazorpayOrder(
  jwt: string,
  orderData: Record<string, unknown>,
  payment: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }
): Promise<Response> {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwt}`,
  };
  const body = {
    data: orderData,
    razorpay_payment_id: payment.razorpay_payment_id,
    razorpay_order_id: payment.razorpay_order_id,
    razorpay_signature: payment.razorpay_signature,
  };

  let res = await fetch(`${BACKEND}/api/orders/razorpay-confirm`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (res.status === 404 || res.status === 405) {
    res = await fetch(`${BACKEND}/api/orders`, {
      method: "POST",
      headers,
      body: JSON.stringify({ ...body, razorpayConfirm: true }),
    });
  }

  return res;
}

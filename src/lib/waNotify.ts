/**
 * Fire-and-forget calls to yuga-farms-wa (same VPS).
 * Messaging is always handled by the WA service — never Meta APIs from the storefront.
 */

type CartLine = {
  productId: number;
  variantId: number;
  quantity: number;
  price: number;
  weight: number;
  productTitle: string;
  productImage?: string;
};

async function waFetch(path: string, body: unknown) {
  try {
    await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    });
  } catch (e) {
    console.warn("[waNotify]", path, e);
  }
}

export function notifyCartSync(input: {
  userId: number;
  phone?: string;
  items: CartLine[];
  totalItems: number;
  totalPrice: number;
}) {
  if (!input.userId) return;
  void waFetch("/api/wa/cart-sync", {
    ...input,
    notifyChatbotOnly: true,
  });
}

export function notifyOrderPlaced(input: {
  strapiOrderId: number;
  orderNumber: string;
  total: number;
  phone: string;
  userId?: number;
  customerName?: string;
  items: CartLine[];
}) {
  if (!input.phone || !input.strapiOrderId) return;
  void waFetch("/api/wa/order-placed", input);
}

import { NextRequest, NextResponse } from "next/server";

const WA_SERVICE_URL = process.env.WA_SERVICE_URL?.replace(/\/$/, "");
const WA_INTERNAL_SECRET = process.env.WA_INTERNAL_SECRET;

export async function POST(req: NextRequest) {
  if (!WA_SERVICE_URL || !WA_INTERNAL_SECRET) {
    return NextResponse.json({ ok: false, skipped: true });
  }

  const body = await req.json();
  const res = await fetch(`${WA_SERVICE_URL}/api/internal/cart-sync`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-wa-internal-secret": WA_INTERNAL_SECRET,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

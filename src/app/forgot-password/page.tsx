"use client";
import { useState } from "react";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:1337";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || "Failed to send reset email");
      }
      setSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] bg-[#fdf7f2] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur rounded-xl shadow border border-[#2D2D2D]/10 p-6">
        <h1 className="text-2xl font-semibold text-[#4b2e19] text-center">Forgot password</h1>
        <p className="text-sm text-[#2D2D2D]/70 text-center mt-1">We will email you a reset link</p>

        {error && (
          <div className="mt-4 text-sm text-[#7a1a1a] bg-[#fddedd] border border-[#7a1a1a]/20 rounded p-3">
            {error}
          </div>
        )}

        {sent ? (
          <div className="mt-6 text-sm text-[#2D2D2D] bg-[#f5d26a]/20 border border-[#f5d26a]/40 rounded p-3">
            If an account exists for {email}, you will receive an email with a link to reset your password.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm text-[#2D2D2D]/80 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-[#2D2D2D]/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5d26a] bg-white"
                placeholder="you@example.com"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4b2e19] text-[#f5d26a] font-semibold py-2 rounded-lg hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}



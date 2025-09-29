"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:1337";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const code = params.get("code");

  useEffect(() => {
    if (!code) {
      setError("Reset code is missing. Please use the link from your email.");
    }
  }, [code]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    if (password !== passwordConfirmation) {
      setError("Passwords do not match");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, password, passwordConfirmation }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || "Failed to reset password");
      }
      setSuccess(true);
      setTimeout(() => router.replace("/login"), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] bg-[#fdf7f2] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur rounded-xl shadow border border-[#2D2D2D]/10 p-6">
        <h1 className="text-2xl font-semibold text-[#4b2e19] text-center">Reset password</h1>
        <p className="text-sm text-[#2D2D2D]/70 text-center mt-1">Enter your new password</p>

        {error && (
          <div className="mt-4 text-sm text-[#7a1a1a] bg-[#fddedd] border border-[#7a1a1a]/20 rounded p-3">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-4 text-sm text-[#2D2D2D] bg-[#f5d26a]/20 border border-[#f5d26a]/40 rounded p-3">
            Password updated. Redirecting to login...
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm text-[#2D2D2D]/80 mb-1">New password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-[#2D2D2D]/20 px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#f5d26a] bg-white"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#2D2D2D]/70 hover:text-[#4b2e19]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7 0-1.07.41-2.064 1.125-2.925M6.223 6.223A10.05 10.05 0 0112 5c5 0 9 4 9 7 0 1.07-.41 2.064-1.125 2.925M3 3l18 18" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm text-[#2D2D2D]/80 mb-1">Confirm new password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              className="w-full rounded-lg border border-[#2D2D2D]/20 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#f5d26a] bg-white"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading || !code}
            className="w-full bg-[#4b2e19] text-[#f5d26a] font-semibold py-2 rounded-lg hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? "Updating..." : "Reset password"}
          </button>
        </form>
      </div>
    </div>
  );
}



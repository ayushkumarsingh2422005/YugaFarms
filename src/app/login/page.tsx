"use client";
import { Suspense, useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";

function LoginPageContent() {
  const { sendOTP, loginWithOTP, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  const afterLoginPath =
    redirectTo && redirectTo.startsWith("/") && !redirectTo.startsWith("//")
      ? redirectTo
      : "/";

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.replace(afterLoginPath);
    }
  }, [user, router, afterLoginPath]);

  // Countdown effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate phone number (should be exactly 10 digits)
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    try {
      // Add +91 prefix for OTP sending
      const fullPhone = `+91${cleanPhone}`;
      await sendOTP(fullPhone);
      setStep("otp");
      setCountdown(60); // 60 second countdown
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const cleanPhone = phone.replace(/\D/g, '');
      const fullPhone = `+91${cleanPhone}`;
      await loginWithOTP(fullPhone, otp);
      router.replace(afterLoginPath);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    setError(null);
    setLoading(true);
    try {
      const cleanPhone = phone.replace(/\D/g, '');
      const fullPhone = `+91${cleanPhone}`;
      await sendOTP(fullPhone);
      setCountdown(60);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToPhone = () => {
    setStep("phone");
    setOtp("");
    setError(null);
  };

  return (
    <>
      <TopBar />
      <div className="min-h-[calc(100vh-200px)] bg-[#fdf7f2] flex items-center justify-center px-4 pt-16 md:pt-24 pb-12">
        <div className="w-full max-w-md bg-white/80 backdrop-blur rounded-2xl shadow-lg border border-[#2D2D2D]/10 p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-[#4b2e19] mb-2">
              {step === "phone" ? "Welcome Back" : "Enter OTP"}
            </h1>
            <p className="text-sm text-[#2D2D2D]/70">
              {step === "phone"
                ? "Login with your phone number to continue"
                : `We've sent a 6-digit code to +91 ${phone}`}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          {step === "phone" ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#2D2D2D] mb-2">
                  Phone Number
                </label>
                <div className="flex items-center border border-[#4b2e19]/20 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#f5d26a]/50 focus-within:border-[#f5d26a]">
                  <span className="px-4 py-3 bg-[#f5d26a]/10 text-[#4b2e19] font-semibold border-r border-[#4b2e19]/20">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setPhone(digits);
                    }}
                    placeholder="9876543210"
                    maxLength={10}
                    className="flex-1 px-4 py-3 focus:outline-none text-[#2D2D2D]"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#4b2e19] text-white py-3 rounded-xl font-semibold hover:bg-[#2f4f2f] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOTPSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#2D2D2D] mb-2">
                  Enter 6-digit OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full border border-[#4b2e19]/20 rounded-xl px-4 py-3 text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-[#f5d26a]/50 focus:border-[#f5d26a] text-[#2D2D2D]"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-[#4b2e19] text-white py-3 rounded-xl font-semibold hover:bg-[#2f4f2f] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Verifying..." : "Verify & Login"}
              </button>
              <div className="text-center space-y-2">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={countdown > 0}
                  className="text-sm text-[#4b2e19] hover:text-[#2f4f2f] disabled:text-[#2D2D2D]/30 disabled:cursor-not-allowed"
                >
                  {countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP"}
                </button>
                <div>
                  <button
                    type="button"
                    onClick={handleBackToPhone}
                    className="text-sm text-[#2D2D2D]/70 hover:text-[#2D2D2D] transition-colors"
                  >
                    Change phone number
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <>
          <TopBar />
          <div className="min-h-[calc(100vh-200px)] bg-[#fdf7f2] flex items-center justify-center">
            <p className="text-[#4b2e19]">Loading...</p>
          </div>
          <Footer />
        </>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}

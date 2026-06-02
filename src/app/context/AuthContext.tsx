"use client";
import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { loginPath, parseApiErrorMessage } from "@/lib/authSession";
import { ApiAuthError, getUserIdFromJwt } from "@/lib/apiAuthError";
import {
  type UserProfile,
  type CheckoutAddressForm,
  parseStrapiUser,
  checkoutAddressToStrapiPayload,
} from "@/lib/userProfile";

type AuthUser = {
  id: number;
  username: string;
  email: string;
  provider?: string | null;
};

type AuthContextType = {
  user: AuthUser | null;
  jwt: string | null;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  loginWithOTP: (phone: string, code: string) => Promise<void>;
  sendOTP: (phone: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  /** Full Strapi profile (address, phone, email) — kept in sync across screens. */
  userProfile: UserProfile | null;
  profileRevision: number;
  /** False until the first /users/me fetch for the current JWT has finished. */
  profileReady: boolean;
  fetchUserProfile: () => Promise<UserProfile | null>;
  updateUserProfile: (patch: Record<string, string | number>) => Promise<UserProfile | null>;
  updateUserProfileFromCheckout: (address: CheckoutAddressForm) => Promise<UserProfile | null>;
  /** Clear session and navigate to login (optional return path after login). */
  redirectToLogin: (returnTo?: string) => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  jwt: "ygf_jwt",
  user: "ygf_user",
};

const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:1337";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [jwt, setJwt] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileRevision, setProfileRevision] = useState(0);
  const [profileReady, setProfileReady] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const storedJwt = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEYS.jwt) : null;
      const storedUser = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEYS.user) : null;
      if (storedJwt) setJwt(storedJwt);
      if (storedUser) setUser(JSON.parse(storedUser));
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  const persist = useCallback((nextJwt: string, nextUser: AuthUser) => {
    setJwt(nextJwt);
    setUser(nextUser);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.jwt, nextJwt);
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(nextUser));
    }
  }, []);

  const clear = useCallback(() => {
    setJwt(null);
    setUser(null);
    setUserProfile(null);
    setProfileRevision(0);
    setProfileReady(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.jwt);
      localStorage.removeItem(STORAGE_KEYS.user);
    }
  }, []);

  const redirectToLogin = useCallback(
    (returnTo?: string) => {
      clear();
      router.replace(loginPath(returnTo));
    },
    [clear, router]
  );

  const applyProfileFromMe = useCallback((me: Record<string, unknown>) => {
    const profile = parseStrapiUser(me);
    setUserProfile(profile);
    const nextUser: AuthUser = {
      id: profile.id,
      username: profile.username,
      email: profile.email,
      provider: (me.provider as string | null) ?? null,
    };
    setUser(nextUser);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(nextUser));
    }
    setProfileRevision((n) => n + 1);
    return profile;
  }, []);

  const fetchUserProfile = useCallback(async (): Promise<UserProfile | null> => {
    if (!jwt) {
      setUserProfile(null);
      setProfileReady(true);
      return null;
    }
    try {
      const res = await fetch(`${BACKEND}/api/users/me`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      if (res.status === 401) {
        setUserProfile(null);
        clear();
        return null;
      }
      if (!res.ok) return null;
      const me = (await res.json()) as Record<string, unknown>;
      return applyProfileFromMe(me);
    } finally {
      setProfileReady(true);
    }
  }, [jwt, applyProfileFromMe, clear]);

  const updateUserProfile = useCallback(
    async (patch: Record<string, string | number>): Promise<UserProfile | null> => {
      if (!jwt) {
        throw new ApiAuthError("Please sign in again.", 401);
      }
      if (Object.keys(patch).length === 0) {
        return userProfile;
      }

      const res = await fetch(`${BACKEND}/api/profile/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify(patch),
      });

      if (!res.ok) {
        const message = await parseApiErrorMessage(res, "Failed to update profile");
        throw new ApiAuthError(message, res.status);
      }

      const body = (await res.json()) as Record<string, unknown>;
      return applyProfileFromMe(body);
    },
    [jwt, userProfile, applyProfileFromMe]
  );

  const updateUserProfileFromCheckout = useCallback(
    async (address: CheckoutAddressForm): Promise<UserProfile | null> => {
      const payload = checkoutAddressToStrapiPayload(address);
      if (Object.keys(payload).length === 0) return userProfile;
      return updateUserProfile(payload);
    },
    [updateUserProfile, userProfile]
  );

  useEffect(() => {
    if (!jwt) {
      setUserProfile(null);
      setProfileReady(true);
      return;
    }
    setProfileReady(false);
    void fetchUserProfile();
  }, [jwt, fetchUserProfile]);

  // Keep cached user id aligned with JWT (prevents PUT to wrong id / false logouts)
  useEffect(() => {
    if (!jwt) return;
    const id = getUserIdFromJwt(jwt);
    if (id == null) return;
    if (user?.id === id) return;
    setUser((prev) =>
      prev
        ? { ...prev, id }
        : { id, username: "", email: "", provider: null }
    );
  }, [jwt, user?.id]);

  const login = useCallback(async (identifier: string, password: string) => {
    const res = await fetch(`${BACKEND}/api/auth/local`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || "Login failed");
    }
    const data = await res.json();
    persist(data.jwt, {
      id: data.user.id,
      username: data.user.username,
      email: data.user.email,
      provider: data.user.provider,
    });
  }, [persist]);

  const signup = useCallback(async (username: string, email: string, password: string) => {
    const res = await fetch(`${BACKEND}/api/auth/local/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || "Signup failed");
    }
    const data = await res.json();
    persist(data.jwt, {
      id: data.user.id,
      username: data.user.username,
      email: data.user.email,
      provider: data.user.provider,
    });
  }, [persist]);

  const refreshUser = useCallback(async () => {
    await fetchUserProfile();
  }, [fetchUserProfile]);

  const sendOTP = useCallback(async (phone: string) => {
    const res = await fetch(`${BACKEND}/api/otp/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || "Failed to send OTP");
    }
  }, []);

  const loginWithOTP = useCallback(async (phone: string, code: string) => {
    const res = await fetch(`${BACKEND}/api/otp/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, code }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || "OTP verification failed");
    }
    const data = await res.json();
    persist(data.jwt, {
      id: data.user.id,
      username: data.user.username,
      email: data.user.email || "",
      provider: data.user.provider,
    });
  }, [persist]);

  const logout = useCallback(() => {
    clear();
  }, [clear]);

  const value = useMemo<AuthContextType>(() => ({
    user,
    jwt,
    isLoading,
    login,
    signup,
    loginWithOTP,
    sendOTP,
    logout,
    refreshUser,
    userProfile,
    profileRevision,
    profileReady,
    fetchUserProfile,
    updateUserProfile,
    updateUserProfileFromCheckout,
    redirectToLogin,
  }), [
    user,
    jwt,
    isLoading,
    login,
    signup,
    loginWithOTP,
    sendOTP,
    logout,
    refreshUser,
    userProfile,
    profileRevision,
    profileReady,
    fetchUserProfile,
    updateUserProfile,
    updateUserProfileFromCheckout,
    redirectToLogin,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}



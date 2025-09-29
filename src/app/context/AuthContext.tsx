"use client";
import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";

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
  logout: () => void;
  refreshUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  jwt: "ygf_jwt",
  user: "ygf_user",
};

const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:1337";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [jwt, setJwt] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const storedJwt = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEYS.jwt) : null;
      const storedUser = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEYS.user) : null;
      if (storedJwt) setJwt(storedJwt);
      if (storedUser) setUser(JSON.parse(storedUser));
    } catch (e) {
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
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.jwt);
      localStorage.removeItem(STORAGE_KEYS.user);
    }
  }, []);

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
    if (!jwt) return;
    const res = await fetch(`${BACKEND}/api/users/me`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    if (!res.ok) return;
    const me = await res.json();
    const nextUser: AuthUser = { id: me.id, username: me.username, email: me.email, provider: me.provider };
    setUser(nextUser);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(nextUser));
  }, [jwt]);

  const logout = useCallback(() => {
    clear();
  }, [clear]);

  const value = useMemo<AuthContextType>(() => ({ user, jwt, isLoading, login, signup, logout, refreshUser }), [user, jwt, isLoading, login, signup, logout, refreshUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}



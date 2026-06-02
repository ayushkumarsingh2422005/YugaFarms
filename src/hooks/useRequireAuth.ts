"use client";

import { useCallback, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { isAuthFailure } from "@/lib/authSession";

type Options = {
  /** When false, only exposes handleAuthFailure (no auto-redirect on missing jwt). */
  requireSession?: boolean;
};

/**
 * Guard protected pages: redirect to login when session is missing or API auth fails.
 */
export function useRequireAuth(returnPath: string, options?: Options) {
  const requireSession = options?.requireSession ?? true;
  const { jwt, isLoading, redirectToLogin } = useAuth();

  useEffect(() => {
    if (!requireSession || isLoading) return;
    if (!jwt) {
      redirectToLogin(returnPath);
    }
  }, [requireSession, isLoading, jwt, redirectToLogin, returnPath]);

  const handleAuthFailure = useCallback(
    (status?: number, message?: string) => {
      if (isAuthFailure(status, message)) {
        redirectToLogin(returnPath);
        return true;
      }
      return false;
    },
    [redirectToLogin, returnPath]
  );

  return {
    jwt,
    isLoading,
    isAuthed: !isLoading && !!jwt,
    handleAuthFailure,
    redirectToLogin,
  };
}

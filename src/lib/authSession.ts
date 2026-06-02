/**
 * True only when the session is actually invalid (expired/missing JWT).
 * Do not treat 403 policy/validation errors or generic "Forbidden" as logout.
 */
export function isAuthFailure(status?: number, message?: string): boolean {
  if (status === 401) return true;
  const m = (message || "").toLowerCase();
  if (
    m.includes("invalid credentials") ||
    m.includes("missing or invalid credentials") ||
    m.includes("invalid token") ||
    m.includes("token expired") ||
    m.includes("jwt expired") ||
    m.includes("no authorization") ||
    /\bjwt\b.*\b(expired|invalid|missing)\b/.test(m) ||
    /\b(expired|invalid|missing)\b.*\bjwt\b/.test(m)
  ) {
    return true;
  }
  // 403 only when message clearly indicates auth, not Strapi policy/field errors
  if (status === 403) {
    return (
      m.includes("invalid token") ||
      m.includes("token expired") ||
      m.includes("missing or invalid credentials") ||
      m.includes("not authenticated") ||
      m.includes("not authorized to access")
    );
  }
  return false;
}

export function loginPath(returnTo?: string): string {
  if (!returnTo || !returnTo.startsWith("/")) {
    return "/login";
  }
  return `/login?redirect=${encodeURIComponent(returnTo)}`;
}

export async function parseApiErrorMessage(
  response: Response,
  fallback = "Request failed"
): Promise<string> {
  try {
    const data = (await response.json()) as {
      error?: { message?: string };
      message?: string;
    };
    return data?.error?.message || data?.message || fallback;
  } catch {
    return fallback;
  }
}

export function messageFromError(err: unknown, fallback = "Something went wrong"): string {
  return err instanceof Error ? err.message : fallback;
}

/** Redirect to login when auth failed; returns true if redirected. */
export function redirectIfAuthFailure(
  redirectToLogin: (returnTo?: string) => void,
  returnPath: string,
  status?: number,
  message?: string
): boolean {
  if (isAuthFailure(status, message)) {
    redirectToLogin(returnPath);
    return true;
  }
  return false;
}

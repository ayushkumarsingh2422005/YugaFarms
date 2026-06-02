/** Detect Strapi/JWT auth failures that should send the user back to login. */
export function isAuthFailure(status?: number, message?: string): boolean {
  if (status === 401 || status === 403) return true;
  const m = (message || "").toLowerCase();
  return (
    m.includes("invalid credentials") ||
    m.includes("unauthorized") ||
    m.includes("forbidden") ||
    m.includes("jwt") ||
    m.includes("must be logged in") ||
    (m.includes("token") &&
      (m.includes("expired") || m.includes("invalid") || m.includes("missing")))
  );
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

/** API error with HTTP status for auth handling (avoid logging out on validation/permission errors). */
export class ApiAuthError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiAuthError";
    this.status = status;
  }
}

/** Read Strapi JWT user id from token payload (fallback when cached user id is stale). */
export function getUserIdFromJwt(token: string | null): number | null {
  if (!token) return null;
  try {
    const segment = token.split(".")[1];
    if (!segment) return null;
    const json = atob(segment.replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(json) as { id?: number | string };
    const id = payload.id;
    if (id == null) return null;
    const n = typeof id === "number" ? id : parseInt(String(id), 10);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

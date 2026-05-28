import { getProductSlug, slugifyProductTitle } from "@/lib/productSlug";

const DEFAULT_BACKEND = "http://localhost:1337";

/** Public Strapi host used for media in next.config — safe SSR fallback when env vars are missing on Vercel. */
const PRODUCTION_STRAPI_PUBLIC = "https://server.yugafarms.com";

/**
 * Prefer BACKEND_URL on the server, then NEXT_PUBLIC_BACKEND.
 * On Vercel without env, fall back to production Strapi so blog/product SSR is not empty (crawlers see real links).
 */
export function getBackendUrl(): string {
  if (typeof window === "undefined" && process.env.BACKEND_URL) {
    return process.env.BACKEND_URL;
  }
  if (process.env.NEXT_PUBLIC_BACKEND) {
    return process.env.NEXT_PUBLIC_BACKEND;
  }
  if (typeof window === "undefined" && process.env.VERCEL) {
    return PRODUCTION_STRAPI_PUBLIC;
  }
  return DEFAULT_BACKEND;
}

const REVALIDATE_SECONDS = 300;

async function fetchStrapiJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export type ProductVariant = {
  id: number;
  Price: number;
  Discount: number;
  Weight: number;
  Stock: number;
  Label?: string | null;
};

export type ProductTag = {
  id: number;
  Value: string;
};

export type ProductImage = {
  id: number;
  url: string;
  alternativeText?: string;
};

export type Product = {
  id: number;
  slug?: string | null;
  Title: string;
  Order?: number | null;
  Description: string;
  Rating: number;
  PunchLine: string;
  NumberOfPurchase: number;
  Type: "Ghee" | "Honey";
  TopPicks: boolean;
  Variants: ProductVariant[];
  Tags: ProductTag[];
  Image: ProductImage[];
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type BannerMedia = {
  id: number;
  name: string;
  mime: string;
  url: string;
  alternativeText?: string | null;
  formats?: {
    thumbnail?: { url: string };
    small?: { url: string };
    large?: { url: string };
  };
};

export type ClientImage = {
  id: number;
  url: string;
  alternativeText?: string | null;
  formats?: {
    thumbnail?: { url: string };
    small?: { url: string };
  };
};

export type Client = {
  id: number;
  Name: string;
  Review: string;
  Rating: number;
  Designation: string | null;
  Image: ClientImage | null;
};

export type BlogSection = {
  id: number;
  documentId: string;
  Title: string;
  sluge: string;
  Content: string;
  CoverImage: {
    id: number;
    url: string;
    alternativeText: string | null;
  } | null;
  publishedAt: string;
};

export type ProductCommentType = "Common" | "Ghee" | "Honey";

export type ProductComment = {
  id: number;
  Comment: string;
  Type: ProductCommentType;
  Rating?: number | null;
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id: number;
    username?: string | null;
  } | null;
};

export async function getBannerMedia(): Promise<BannerMedia[]> {
  const backend = getBackendUrl();
  const data = await fetchStrapiJson<{ data?: { Banner?: BannerMedia[] } }>(
    `${backend}/api/banner?populate=*`
  );
  return data?.data?.Banner ?? [];
}

export async function getTopPicksProducts(): Promise<Product[]> {
  const backend = getBackendUrl();
  const data = await fetchStrapiJson<{ data?: Product[] }>(
    `${backend}/api/products?filters[TopPicks][$eq]=true&populate=*&sort[0]=Order:asc&sort[1]=NumberOfPurchase:desc`
  );
  return data?.data ?? [];
}

export async function getClients(): Promise<Client[]> {
  const backend = getBackendUrl();
  const data = await fetchStrapiJson<{ data?: Client[] }>(`${backend}/api/clients?populate=*`);
  return data?.data ?? [];
}

export async function getProductsByType(type: "Ghee" | "Honey"): Promise<Product[]> {
  const backend = getBackendUrl();
  const data = await fetchStrapiJson<{ data?: Product[] }>(
    `${backend}/api/products?filters[Type][$eq]=${type}&filters[TopPicks][$eq]=false&populate=*&sort[0]=Order:asc&sort[1]=NumberOfPurchase:desc`
  );
  return data?.data ?? [];
}

/** All live products of a type (includes Top Picks), sorted by configured order. */
export async function getAllProductsByType(type: "Ghee" | "Honey"): Promise<Product[]> {
  const backend = getBackendUrl();
  const data = await fetchStrapiJson<{ data?: Product[] }>(
    `${backend}/api/products?filters[Type][$eq]=${type}&populate=*&sort[0]=Order:asc&sort[1]=NumberOfPurchase:desc`
  );
  return data?.data ?? [];
}

/** Same category first, then the other (e.g. on a Ghee PDP: other Ghee, then Honey). */
export async function getSimilarProducts(
  current: Product,
  limit = 8
): Promise<Product[]> {
  const primaryType = current.Type;
  const secondaryType = primaryType === "Ghee" ? "Honey" : "Ghee";

  const [primary, secondary] = await Promise.all([
    getAllProductsByType(primaryType),
    getAllProductsByType(secondaryType),
  ]);

  const excludeCurrent = (p: Product) => p.id !== current.id;
  return [...primary.filter(excludeCurrent), ...secondary.filter(excludeCurrent)].slice(
    0,
    limit
  );
}

export async function getProductById(id: string): Promise<Product | null> {
  const backend = getBackendUrl();
  let data = await fetchStrapiJson<{ data?: Product }>(
    `${backend}/api/products/${id}?publicationState=live&populate=*`
  );
  if (!data?.data) {
    data = await fetchStrapiJson<{ data?: Product }>(
      `${backend}/api/products/${id}?populate=*`
    );
  }
  if (data?.data) return data.data;

  const list = await fetchStrapiJson<{ data?: Product[] }>(`${backend}/api/products?populate=*`);
  return list?.data?.find((p) => p.id.toString() === id) ?? null;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const backend = getBackendUrl();
  const encoded = encodeURIComponent(slug);

  const bySlugFilter = async (withLive: boolean) => {
    const qs = withLive ? "&publicationState=live" : "";
    return fetchStrapiJson<{ data?: Product[] }>(
      `${backend}/api/products?filters[slug][$eq]=${encoded}&populate=*${qs}`
    );
  };

  let rows = (await bySlugFilter(true))?.data;
  if (!rows?.length) rows = (await bySlugFilter(false))?.data;
  if (rows?.[0]) return rows[0];

  if (/^\d+$/.test(slug)) {
    return getProductById(slug);
  }

  const list = await fetchStrapiJson<{ data?: Product[] }>(
    `${backend}/api/products?populate=*`
  );
  const products = list?.data ?? [];
  return (
    products.find((p) => getProductSlug(p) === slug) ??
    products.find((p) => slugifyProductTitle(p.Title) === slug) ??
    null
  );
}

export async function getBlogSections(): Promise<BlogSection[]> {
  const backend = getBackendUrl();
  const data = await fetchStrapiJson<{ data?: BlogSection[] }>(
    `${backend}/api/blog-sections?populate=*&sort=publishedAt:desc`
  );
  return data?.data ?? [];
}

export async function getBlogBySlug(slug: string): Promise<BlogSection | null> {
  const backend = getBackendUrl();
  const data = await fetchStrapiJson<{ data?: BlogSection[] }>(
    `${backend}/api/blog-sections?filters[sluge][$eq]=${encodeURIComponent(slug)}&populate=*`
  );
  const rows = data?.data;
  return rows && rows.length > 0 ? rows[0] : null;
}

/**
 * Fetch comments applicable to a product type:
 * - Common comments
 * - Type-specific comments (Ghee/Honey)
 */
export async function getProductComments(type: "Ghee" | "Honey"): Promise<ProductComment[]> {
  const backend = getBackendUrl();
  const url = `${backend}/api/comments?filters[$or][0][Type][$eq]=Common&filters[$or][1][Type][$eq]=${type}&sort=createdAt:desc&populate[user][fields][0]=id&populate[user][fields][1]=username`;
  let data: { data?: ProductComment[] } | null = null;
  try {
    // Reviews should reflect immediately after submit/edit; avoid SSR revalidate cache here.
    const res = await fetch(url, { cache: "no-store" });
    if (res.ok) data = (await res.json()) as { data?: ProductComment[] };
  } catch {
    data = null;
  }
  return (data?.data ?? []).filter((row) => Boolean(row?.Comment?.trim()));
}

export function stripHtmlToPlain(text: string, maxLen: number): string {
  const plain = text.replace(/<[^>]*>?/gm, "").replace(/\s+/g, " ").trim();
  if (plain.length <= maxLen) return plain;
  return `${plain.slice(0, maxLen)}…`;
}

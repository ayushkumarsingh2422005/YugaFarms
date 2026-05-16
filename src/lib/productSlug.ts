/** URL-safe slug from product title (fallback when Strapi `slug` is empty). */
export function slugifyProductTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Canonical storefront path segment for a product. */
export function getProductSlug(product: {
  slug?: string | null;
  Title: string;
  id: number;
}): string {
  const fromApi = product.slug?.trim();
  if (fromApi) return fromApi;
  const fromTitle = slugifyProductTitle(product.Title);
  return fromTitle || String(product.id);
}

export function productDetailPath(product: {
  slug?: string | null;
  Title: string;
  id: number;
}): string {
  return `/product/${getProductSlug(product)}`;
}

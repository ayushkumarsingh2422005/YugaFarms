import { productDetailPath } from "@/lib/productSlug";
import {
  getBackendUrl,
  stripHtmlToPlain,
  type BlogSection,
  type Product,
} from "@/lib/strapiPublic";

export const SITE_NAME = "YugaFarms";

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_BASE_URL || "https://www.yugafarms.com").replace(/\/$/, "");
}

/** Meta description length aligned with Google’s typical display (~150–160 chars). */
export function truncateMetaDescription(text: string, maxLen = 160): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= maxLen) return t;
  const cut = t.slice(0, maxLen - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 80 ? cut.slice(0, lastSpace) : cut).trim() + "…";
}

export function productMetaDescription(product: Product): string {
  const plain = stripHtmlToPlain(product.Description || "", 400);
  const punch = (product.PunchLine || "").trim();
  if (plain.length >= 120) {
    return truncateMetaDescription(plain, 160);
  }
  const filler = `${product.Title}. ${punch} Buy A2 ghee & raw honey online in India — bilona method, lab-tested. Shop YugaFarms.`;
  return truncateMetaDescription([plain, punch, filler].filter(Boolean).join(" "), 160);
}

/** Use when Strapi leaves filename as alt (e.g. IMG_1017.png). */
export function seoBannerImageAlt(media: {
  alternativeText?: string | null;
  name?: string | null;
}): string {
  const raw = (media.alternativeText || media.name || "").trim();
  const looksLikeFilename =
    !raw ||
    /^IMG[_-]?\d+/i.test(raw) ||
    /\.(png|jpe?g|webp|gif|svg)$/i.test(raw) ||
    raw.length < 12;
  if (looksLikeFilename) {
    return "Pure A2 bilona cow ghee and natural multifloral honey — YugaFarms, Sahiwal cow ghee, India delivery";
  }
  return raw;
}

/** Blog index — exposes every post URL to crawlers that read JSON-LD. */
export function buildBlogIndexItemListJsonLd(blogs: BlogSection[]) {
  const base = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: blogs.length,
    itemListElement: blogs.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.Title,
      item: `${base}/blogs/${b.sluge}`,
    })),
  };
}

export function buildBlogPostingJsonLd(blog: BlogSection) {
  const url = getSiteUrl();
  const backend = getBackendUrl();
  const articleUrl = `${url}/blogs/${blog.sluge}`;
  const image = blog.CoverImage?.url
    ? blog.CoverImage.url.startsWith("http")
      ? blog.CoverImage.url
      : `${backend}${blog.CoverImage.url}`
    : undefined;
  const plain = stripHtmlToPlain(blog.Content || "", 4000);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.Title,
    datePublished: blog.publishedAt,
    description: truncateMetaDescription(plain, 200),
    url: articleUrl,
    mainEntityOfPage: articleUrl,
    image: image ? [image] : undefined,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${url}/logomark.svg`,
      },
    },
  };
}

export function buildOrganizationJsonLd() {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url,
    logo: `${url}/logomark.svg`,
    description:
      "Pure A2 cow ghee made with the traditional bilona method and raw forest honey. Buy ghee and honey online in India from YugaFarms.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Janouli, Palwal",
      addressRegion: "Haryana",
      postalCode: "121102",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-96710-12177",
      contactType: "customer service",
      email: "support@yugafarms.com",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi"],
    },
  };
}

export function buildBreadcrumbJsonLd(items: { name: string; path: string }[]) {
  const base = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${base}${it.path.startsWith("/") ? it.path : `/${it.path}`}`,
    })),
  };
}

export function buildProductJsonLd(product: Product, backendMediaOrigin: string) {
  const url = getSiteUrl();
  const productUrl = `${url}${productDetailPath(product)}`;
  const desc = stripHtmlToPlain(product.Description || "", 5000);
  const images =
    product.Image?.map((img) =>
      img.url.startsWith("http") ? img.url : `${backendMediaOrigin}${img.url}`
    ).filter(Boolean) ?? [];

  const variants = product.Variants || [];
  const inStock = variants.some((v) => v.Stock > 0);
  const prices = variants.map((v) => Math.max(0, v.Price - (v.Discount || 0)));
  const lowPrice = prices.length ? Math.min(...prices) : 0;
  const highPrice = prices.length ? Math.max(...prices) : lowPrice;
  if (variants.length === 0) {
    return {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.Title,
      description: desc || product.PunchLine,
      image: images.length ? images : undefined,
      brand: { "@type": "Brand", name: SITE_NAME },
      sku: String(product.id),
      offers: {
        "@type": "Offer",
        priceCurrency: "INR",
        price: 0,
        availability: "https://schema.org/OutOfStock",
        url: productUrl,
      },
    };
  }

  const offers =
    variants.length > 1
      ? {
          "@type": "AggregateOffer",
          priceCurrency: "INR",
          lowPrice,
          highPrice,
          offerCount: variants.length,
          availability: inStock
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          url: productUrl,
        }
      : {
          "@type": "Offer",
          priceCurrency: "INR",
          price: lowPrice,
          availability: inStock
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          url: productUrl,
        };

  const json: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.Title,
    description: desc || product.PunchLine,
    image: images.length ? images : undefined,
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    sku: String(product.id),
    offers,
  };

  if (product.Rating > 0) {
    json.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.Rating,
      bestRating: 5,
      worstRating: 1,
      ratingCount: Math.max(1, product.NumberOfPurchase || 1),
    };
  }

  return json;
}

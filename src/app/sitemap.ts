import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";
import { productDetailPath } from "@/lib/productSlug";
import { getBlogSections, getProductsByType } from "@/lib/strapiPublic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const lastMod = new Date();

  const staticPaths: {
    path: string;
    priority: number;
    changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  }[] = [
    { path: "", priority: 1, changeFrequency: "daily" },
    { path: "/ghee", priority: 0.9, changeFrequency: "weekly" },
    { path: "/honey", priority: 0.9, changeFrequency: "weekly" },
    { path: "/blogs", priority: 0.85, changeFrequency: "weekly" },
    { path: "/about", priority: 0.75, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.75, changeFrequency: "monthly" },
    { path: "/recipes", priority: 0.7, changeFrequency: "monthly" },
    { path: "/lab-reports", priority: 0.7, changeFrequency: "monthly" },
    { path: "/privacy-policy", priority: 0.4, changeFrequency: "yearly" },
    { path: "/terms-of-service", priority: 0.4, changeFrequency: "yearly" },
    { path: "/shipping-policy", priority: 0.4, changeFrequency: "yearly" },
    { path: "/refund-policy", priority: 0.4, changeFrequency: "yearly" },
  ];

  const [gheeProducts, honeyProducts, blogs] = await Promise.all([
    getProductsByType("Ghee"),
    getProductsByType("Honey"),
    getBlogSections(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map(({ path, priority, changeFrequency }) => ({
    url: `${base}${path}`,
    lastModified: lastMod,
    changeFrequency,
    priority,
  }));

  const productSeen = new Set<number>();
  const productEntries: MetadataRoute.Sitemap = [];
  for (const p of [...gheeProducts, ...honeyProducts]) {
    if (productSeen.has(p.id)) continue;
    productSeen.add(p.id);
    productEntries.push({
      url: `${base}${productDetailPath(p)}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : lastMod,
      changeFrequency: "weekly",
      priority: 0.85,
    });
  }

  const blogEntries: MetadataRoute.Sitemap = blogs.map((b) => ({
    url: `${base}/blogs/${b.sluge}`,
    lastModified: b.publishedAt ? new Date(b.publishedAt) : lastMod,
    changeFrequency: "monthly" as const,
    priority: 0.65,
  }));

  return [...staticEntries, ...productEntries, ...blogEntries];
}

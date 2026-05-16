import { NextResponse } from "next/server";
import { productDetailPath } from "@/lib/productSlug";

export const revalidate = 300;

const META_CATALOG_HEADERS = [
  "id",
  "title",
  "description",
  "availability",
  "condition",
  "price",
  "link",
  "image_link",
  "brand",
  "google_product_category",
  "fb_product_category",
  "quantity_to_sell_on_facebook",
  "sale_price",
  "sale_price_effective_date",
  "item_group_id",
  "gender",
  "color",
  "size",
  "age_group",
  "material",
  "pattern",
  "shipping",
  "shipping_weight",
  "offer_disclaimer",
  "offer_disclaimer_url",
  "video[0].url",
  "video[0].tag[0]",
  "gtin",
  "product_tags[0]",
  "product_tags[1]",
  "style[0]",
] as const;

type ProductVariant = {
  id: number;
  Price?: number;
  Discount?: number;
  Weight?: number;
  Stock: number;
};

type ProductImage = {
  url?: string;
};

type ProductTag = {
  Value?: string;
};

type Product = {
  id: number;
  Title: string;
  Description: string;
  Type?: string;
  Variants?: ProductVariant[];
  Image?: ProductImage[];
  Tags?: ProductTag[];
};

function escapeCsvCell(val: unknown): string {
  if (val == null || val === "") return "";
  const s = String(val).replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const normalized = s.replace(/\n/g, " ").replace(/\s+/g, " ").trim();
  if (/[",\n]/.test(normalized)) {
    return `"${normalized.replace(/"/g, "\"\"")}"`;
  }
  return normalized;
}

function csvRow(cells: string[]): string {
  return cells.map(escapeCsvCell).join(",");
}

function formatMoney(amount: number, currency: string): string {
  const n = Number.isFinite(amount) ? amount : 0;
  return `${n.toFixed(2)} ${currency}`;
}

function absoluteMediaUrl(baseUrl: string, url: string | undefined): string {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
}

async function fetchProductsByType(
  backendUrl: string,
  type: "Ghee" | "Honey"
): Promise<Product[]> {
  const url = `${backendUrl}/api/products?filters[Type][$eq]=${type}&filters[TopPicks][$eq]=false&populate=*`;
  const res = await fetch(url, { next: { revalidate } });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${type} products: ${res.status}`);
  }
  const data = (await res.json()) as { data?: Product[] };
  return data.data || [];
}

export async function GET() {
  try {
    const storefrontUrl = (
      process.env.NEXT_PUBLIC_BASE_URL || "https://www.yugafarms.com"
    ).replace(/\/$/, "");
    const backendUrl = (
      process.env.NEXT_PUBLIC_BACKEND || "https://server.yugafarms.com"
    ).replace(/\/$/, "");
    const currency = (process.env.CATALOG_CURRENCY || "INR").trim();
    const brand = (process.env.CATALOG_BRAND || "Yuga Farms").trim();

    const [gheeProducts, honeyProducts] = await Promise.all([
      fetchProductsByType(backendUrl, "Ghee"),
      fetchProductsByType(backendUrl, "Honey"),
    ]);
    const products = [...gheeProducts, ...honeyProducts].sort((a, b) => a.id - b.id);

    const lines: string[] = [csvRow([...META_CATALOG_HEADERS])];

    for (const product of products) {
      const variants = product.Variants || [];
      if (variants.length === 0) continue;

      const firstImage = product.Image?.[0];
      const imageLink = absoluteMediaUrl(backendUrl, firstImage?.url);
      const productLink = `${storefrontUrl}${productDetailPath(product)}`;
      const desc = product.Description || "";
      const itemGroupId = String(product.id);
      const tag0 = product.Tags?.[0]?.Value ?? "";
      const tag1 = product.Tags?.[1]?.Value ?? "";
      const googleCat =
        product.Type === "Honey"
          ? "Food, Beverages & Tobacco > Food Items > Cooking & Baking Ingredients > Honey"
          : "Food, Beverages & Tobacco > Food Items > Cooking & Baking Ingredients > Oils & Vinegars";

      variants.forEach((variant, index) => {
        const listPrice = Number(variant.Price) || 0;
        const discount = Number(variant.Discount) || 0;
        const saleAmount = Math.max(0, listPrice - discount);
        const onSale = discount > 0 && saleAmount < listPrice;

        const availability = variant.Stock > 0 ? "in stock" : "out of stock";
        const rowId = String(product.id);
        const weightLabel = variant.Weight != null ? `${variant.Weight} g` : "";

        const titleBase = product.Title || "Product";
        const title = variants.length > 1 && weightLabel ? `${titleBase} (${weightLabel})` : titleBase;

        const priceField = formatMoney(listPrice, currency);
        const salePriceField = onSale ? formatMoney(saleAmount, currency) : "";
        const qty = variant.Stock > 0 ? String(Math.max(1, variant.Stock)) : "";

        const shippingWeight =
          variant.Weight != null && variant.Weight > 0 ? `${variant.Weight} g` : "";

        const row = [
            rowId,
            title,
            desc,
            availability,
            "new",
            priceField,
            productLink,
            imageLink,
            brand,
            googleCat,
            "",
            qty,
            salePriceField,
            "",
            itemGroupId,
            "",
            "",
            weightLabel,
            "",
            "",
            "",
            "",
            "",
            shippingWeight,
            "",
            "",
            "",
            "",
            "",
            tag0,
            tag1,
            "",
          ];

        // Hard guard: every data row must match header column count exactly.
        if (row.length !== META_CATALOG_HEADERS.length) {
          if (row.length > META_CATALOG_HEADERS.length) {
            row.length = META_CATALOG_HEADERS.length;
          } else {
            while (row.length < META_CATALOG_HEADERS.length) row.push("");
          }
        }

        lines.push(csvRow(row));
      });
    }

    const csv = `${lines.join("\n")}\n`;
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to generate catalog CSV",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}


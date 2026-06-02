import type { Product, ProductVariant } from "@/lib/strapiPublic";
import { productDetailPath } from "@/lib/productSlug";

const SIZE_IN_TITLE =
  /\s+(?:\d+(\.\d+)?\s*(?:ml|l|kg|g|gram|grams|litre?s?)|(?:\d+(\.\d+)?)L)(?:\s|$|\|)/i;

/** Base name shared by size-specific product entries (e.g. all "A2 Sahiwal Cow Ghee" SKUs). */
export function getProductFamilyKey(title: string): string {
  const head = title.split("|")[0].trim();
  const match = head.match(SIZE_IN_TITLE);
  if (match && match.index != null && match.index > 0) {
    return head.slice(0, match.index).trim().toLowerCase();
  }
  return head.toLowerCase();
}

export function isValidVariant(variant: ProductVariant): boolean {
  const weight = variant.Weight;
  const price = variant.Price;
  return (
    typeof weight === "number" &&
    weight > 0 &&
    typeof price === "number" &&
    price > 0
  );
}

export type FamilyDisplayVariant = {
  productId: number;
  variantId: number;
  weight: number;
  price: number;
  discount: number;
  stock: number;
  label: string | null;
  productTitle: string;
  productPath: string;
};

export function formatVariantUnit(
  weight: number,
  type: "Ghee" | "Honey"
): string {
  if (type === "Ghee") {
    if (weight >= 1000) {
      const liters = weight / 1000;
      return liters % 1 === 0 ? `${liters} L` : `${liters.toFixed(1)} L`;
    }
    return `${weight} ml`;
  }
  if (weight >= 1000) {
    const kg = weight / 1000;
    return kg % 1 === 0 ? `${kg} kg` : `${kg.toFixed(1)} kg`;
  }
  return `${weight} g`;
}

export function variantSelectLabel(type: "Ghee" | "Honey"): string {
  return type === "Ghee" ? "Select size" : "Select pack size";
}

function variantFromProduct(
  product: Product,
  variant: ProductVariant
): FamilyDisplayVariant {
  return {
    productId: product.id,
    variantId: variant.id,
    weight: variant.Weight,
    price: variant.Price,
    discount: variant.Discount ?? 0,
    stock: variant.Stock ?? 0,
    label:
      typeof variant.Label === "string" && variant.Label.trim()
        ? variant.Label.trim()
        : null,
    productTitle: product.Title,
    productPath: productDetailPath(product),
  };
}

export function collectVariantsFromProduct(
  product: Product
): FamilyDisplayVariant[] {
  return (product.Variants ?? [])
    .filter(isValidVariant)
    .map((v) => variantFromProduct(product, v));
}

/** All purchasable sizes for one product family, sorted by weight; one row per weight. */
export function buildFamilyDisplayVariants(
  catalog: Product[],
  anchor: Product
): FamilyDisplayVariant[] {
  const familyKey = getProductFamilyKey(anchor.Title);
  const byWeight = new Map<number, FamilyDisplayVariant>();

  for (const product of catalog) {
    if (product.Type !== anchor.Type) continue;
    if (getProductFamilyKey(product.Title) !== familyKey) continue;
    for (const row of collectVariantsFromProduct(product)) {
      const existing = byWeight.get(row.weight);
      if (!existing || row.price < existing.price) {
        byWeight.set(row.weight, row);
      }
    }
  }

  const rows = Array.from(byWeight.values()).sort((a, b) => a.weight - b.weight);
  if (rows.length > 0) return rows;
  return collectVariantsFromProduct(anchor);
}

export function buildFamilyVariantMap(
  catalog: Product[]
): Map<string, FamilyDisplayVariant[]> {
  const map = new Map<string, FamilyDisplayVariant[]>();
  for (const product of catalog) {
    const key = getProductFamilyKey(product.Title);
    const list = map.get(key) ?? [];
    for (const row of collectVariantsFromProduct(product)) {
      const dup = list.find((x) => x.weight === row.weight);
      if (!dup || row.price < dup.price) {
        if (dup) {
          const idx = list.indexOf(dup);
          list[idx] = row;
        } else {
          list.push(row);
        }
      }
    }
    map.set(key, list);
  }
  for (const [key, list] of map) {
    map.set(
      key,
      [...list].sort((a, b) => a.weight - b.weight)
    );
  }
  return map;
}

export function defaultFamilyVariant(
  family: FamilyDisplayVariant[],
  product: Product
): FamilyDisplayVariant | null {
  const own = collectVariantsFromProduct(product);
  const matchOwn = family.find((row) =>
    own.some(
      (o) => o.productId === row.productId && o.variantId === row.variantId
    )
  );
  if (matchOwn) return matchOwn;
  return family[0] ?? own[0] ?? null;
}

export function familyVariantKey(row: FamilyDisplayVariant): string {
  return `${row.productId}-${row.variantId}`;
}

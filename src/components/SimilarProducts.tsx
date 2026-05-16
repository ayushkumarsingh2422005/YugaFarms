import Link from "next/link";
import Image from "next/image";
import { formatInr } from "@/lib/currency";
import { productDetailPath } from "@/lib/productSlug";
import type { Product } from "@/lib/strapiPublic";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:1337";

function formatWeight(weight: number, type: "Ghee" | "Honey") {
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

export default function SimilarProducts({
  products,
  currentType,
}: {
  products: Product[];
  currentType: "Ghee" | "Honey";
}) {
  if (products.length === 0) return null;

  const otherType = currentType === "Ghee" ? "Honey" : "Ghee";
  const sameTypeProducts = products.filter((p) => p.Type === currentType);
  const otherTypeProducts = products.filter((p) => p.Type === otherType);

  return (
    <section className="py-6 md:py-8 bg-[#fdfbf7] border-t border-[#f0ebe3]">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-center text-xl md:text-2xl font-bold text-[#4b2e19] mb-1">
          You May Also Like
        </h2>
        <p className="text-center text-sm text-[#2D2D2D]/60 mb-5 max-w-lg mx-auto">
          {currentType === "Ghee"
            ? "More ghee from our collection, then explore our honey."
            : "More honey from our collection, then explore our ghee."}
        </p>

        {sameTypeProducts.length > 0 && (
          <div className="mb-5">
            <h3 className="text-sm font-bold text-[#4b2e19] tracking-[0.15em] uppercase mb-3 text-center md:text-left">
              Our {currentType}
            </h3>
            <ProductGrid products={sameTypeProducts} />
          </div>
        )}

        {otherTypeProducts.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-[#4b2e19] tracking-[0.15em] uppercase mb-3 text-center md:text-left">
              Our {otherType}
            </h3>
            <ProductGrid products={otherTypeProducts} />
          </div>
        )}
      </div>
    </section>
  );
}

function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
      {products.map((product) => {
        const variant = product.Variants?.[0];
        const price = variant ? variant.Price - (variant.Discount || 0) : 0;
        const original = variant?.Price ?? 0;

        return (
          <Link
            key={product.id}
            href={productDetailPath(product)}
            className="group flex flex-col rounded-xl overflow-hidden bg-white shadow-[0_2px_16px_rgba(75,46,25,0.06)] hover:shadow-[0_8px_24px_rgba(75,46,25,0.1)] transition-shadow"
          >
            <div className="relative aspect-square bg-[#f5f2ea] overflow-hidden">
              {product.Image?.[0]?.url ? (
                <Image
                  src={`${BACKEND}${product.Image[0].url}`}
                  alt={product.Image[0].alternativeText || product.Title}
                  width={320}
                  height={320}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-4xl opacity-60">
                  {product.Type === "Ghee" ? "\u{1F9C8}" : "\u{1F36F}"}
                </div>
              )}
              <div className="absolute top-2 right-2 flex items-center gap-0.5 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-semibold text-[#2D2D2D]">
                <span className="text-[#f5d26a]">★</span>
                {product.Rating}
              </div>
            </div>
            <div className="flex flex-1 flex-col p-3 md:p-4">
              <h4 className="text-xs md:text-sm font-bold text-[#2D2D2D] line-clamp-2 group-hover:text-[#4b2e19] transition-colors leading-snug">
                {product.Title}
              </h4>
              {variant && (
                <p className="mt-1 text-[10px] md:text-xs text-[#2D2D2D]/55">
                  {formatWeight(variant.Weight, product.Type)}
                </p>
              )}
              <div className="mt-auto pt-2 flex items-baseline gap-2">
                <span className="text-sm md:text-base font-bold text-[#4b2e19]">
                  {formatInr(price)}
                </span>
                {original > price && (
                  <span className="text-xs text-[#2D2D2D]/45 line-through">
                    {formatInr(original)}
                  </span>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

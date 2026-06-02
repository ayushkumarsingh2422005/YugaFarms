'use client'
import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import { useCart } from "@/app/context/CartContext";
import { productDetailPath } from "@/lib/productSlug";
import type { Product } from "@/lib/strapiPublic";
import {
  buildFamilyDisplayVariants,
  defaultFamilyVariant,
  type FamilyDisplayVariant,
  familyVariantKey,
  formatVariantUnit,
} from "@/lib/productFamily";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:1337";

export default function GheePageClient({ products }: { products: Product[] }) {
  const { addToCart, isLoading: cartLoading } = useCart();
  const [selectedKeys, setSelectedKeys] = useState<Record<number, string>>(() => {
    const initial: Record<number, string> = {};
    for (const product of products) {
      const family = buildFamilyDisplayVariants(products, product);
      const def = defaultFamilyVariant(family, product);
      if (def) initial[product.id] = familyVariantKey(def);
    }
    return initial;
  });

  const familyByProductId = useMemo(() => {
    const map = new Map<number, FamilyDisplayVariant[]>();
    for (const product of products) {
      map.set(product.id, buildFamilyDisplayVariants(products, product));
    }
    return map;
  }, [products]);

  const getProductEmoji = (title: string) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('a2') || titleLower.includes('desi')) return '🧈';
    if (titleLower.includes('classic') || titleLower.includes('cow')) return '🐄';
    if (titleLower.includes('buffalo')) return '🥛';
    if (titleLower.includes('organic')) return '🌿';
    if (titleLower.includes('spiced') || titleLower.includes('spice')) return '🌶️';
    if (titleLower.includes('family') || titleLower.includes('pack')) return '👨‍👩‍👧‍👦';
    return '🧈';
  };

  const getProductGradient = (index: number) => {
    const gradients = [
      "from-[#f5d26a] to-[#e6b800]",
      "from-[#2f4f2f] to-[#4b2e19]",
      "from-[#8B4513] to-[#D2691E]",
      "from-[#2f4f2f] to-[#4b2e19]",
      "from-[#8B4513] to-[#D2691E]",
      "from-[#f5d26a] to-[#e6b800]"
    ];
    return gradients[index % gradients.length];
  };

  const getProductBadge = (row?: FamilyDisplayVariant) => row?.label ?? "";

  const handleAddToCart = async (row: FamilyDisplayVariant) => {
    const product = products.find((p) => p.id === row.productId);
    try {
      await addToCart({
        productId: row.productId,
        variantId: row.variantId,
        price: row.price - row.discount,
        weight: row.weight,
        productTitle: row.productTitle,
        productImage:
          product?.Image && product.Image.length > 0
            ? `${BACKEND}${product.Image[0].url}`
            : undefined,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <>
      <TopBar />
      <main className="bg-gradient-to-br from-[#fdf7f2] via-[#f8f4e6] to-[#f0e6d2] relative overflow-hidden pt-6 md:pt-10">
         {/* Hero Section */}
         <div className="relative pt-0">
           <div className="container mx-auto px-4">
             <div className="text-center mb-6 md:mb-10">
               <div className="inline-block relative">
                 <h1 className="text-4xl md:text-7xl font-[Pacifico] text-[#4b2e19] mb-2 md:mb-4">
                   Pure <span className="text-[#f5d26a]">Ghee</span> Collection
                 </h1>
                 <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-[#f5d26a] to-[#4b2e19] rounded-full"></div>
               </div>
               <p className="text-base md:text-xl text-[#2D2D2D]/70 mt-4 md:mt-6 max-w-2xl md:max-w-3xl mx-auto">
                 Traditional bilona-churned ghee, crafted with love and patience. Experience the authentic taste of pure, golden goodness.
               </p>
             </div>
           </div>
         </div>

         {/* Wave into Ghee Products */}
         <div aria-hidden className="relative z-20 -mt-1 md:-mt-2">
           <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block w-full h-[44px] md:h-[90px] text-[#eef2e9] fill-current">
             <path d="M0,80 C120,40 240,120 360,80 S600,40 720,80 960,120 1080,80 1320,40 1440,80 L1440,120 L0,120 Z"></path>
           </svg>
         </div>

        {/* Ghee Products Section */}
        <section className="py-8 md:py-20 bg-[#eef2e9]">
          <div className="container mx-auto px-4">

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              {products.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-[#4b2e19] text-lg">No ghee products available at the moment.</p>
                  <p className="text-[#2D2D2D]/70 mt-2">Please check back later or contact us for more information.</p>
                </div>
              ) : (
                products.map((product, idx) => {
                  const emoji = getProductEmoji(product.Title);
                  const family = familyByProductId.get(product.id) ?? [];
                  const selectedKey =
                    selectedKeys[product.id] ??
                    (defaultFamilyVariant(family, product)
                      ? familyVariantKey(defaultFamilyVariant(family, product)!)
                      : "");
                  const selected =
                    family.find((row) => familyVariantKey(row) === selectedKey) ??
                    family[0];
                  const badge = getProductBadge(selected);
                  const finalPrice = selected ? selected.price - selected.discount : 0;
                  const originalPrice = selected ? selected.price : 0;
                  const savings = originalPrice - finalPrice;
                  const detailHref = selected?.productPath ?? productDetailPath(product);

                  return (
                    <div key={product.id} className="rounded-xl md:rounded-2xl transition-all duration-300 group">
                      {/* Product Image */}
                      <Link href={detailHref} className="block">
                        <div className="relative bg-gradient-to-br from-[#f5d26a]/20 to-[#f5d26a]/10 rounded-t-xl md:rounded-t-2xl border-b border-[#4b2e19]/10 flex items-center justify-center overflow-hidden cursor-pointer aspect-square w-full">
                          {product.Image && product.Image.length > 0 ? (
                            <Image 
                              src={`${BACKEND}${product.Image[0].url}`} 
                              alt={product.Image[0].alternativeText || product.Title}
                              width={400}
                              height={160}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 aspect-square"
                            />
                          ) : (
                            <span className="text-3xl md:text-5xl">{emoji}</span>
                          )}
                          {badge && (
                            <div className="absolute top-1.5 left-1.5 md:top-3 md:left-3">
                              <div className="text-[10px] md:text-xs bg-[#f5d26a] text-[#4b2e19] px-1.5 md:px-2 py-0.5 md:py-1 rounded-full font-semibold">{badge}</div>
                            </div>
                          )}
                          <div className="absolute top-1.5 right-1.5 md:top-3 md:right-3 bg-white/90 backdrop-blur-sm rounded-full px-1.5 md:px-2 py-0.5 md:py-1">
                            <div className="flex items-center gap-0.5 md:gap-1">
                              <svg className="w-2.5 h-2.5 md:w-3 md:h-3 text-[#f5d26a]" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.176 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81H6.93a1 1 0 00.95-.69l1.07-3.292z" />
                              </svg>
                              <span className="text-[10px] md:text-xs font-semibold text-[#2D2D2D]">{product.Rating}</span>
                            </div>
                          </div>
                        </div>
                      </Link>

                      {/* Product Details */}
                      <div className="p-2 md:p-4 space-y-2 md:space-y-3">
                        {/* Title */}
                        <div>
                          <Link href={detailHref} className="block group">
                            <h3 className="text-xs md:text-base font-bold text-[#2D2D2D] mb-0.5 md:mb-1 group-hover:text-[#4b2e19] transition-colors line-clamp-2 leading-tight">{product.Title}</h3>
                          </Link>
                          <p className="text-[10px] md:text-xs text-[#2D2D2D]/70 font-semibold line-clamp-1 mt-0.5">{product.PunchLine}</p>
                        </div>

                        {family.length > 1 && (
                          <select
                            value={selectedKey}
                            onChange={(e) =>
                              setSelectedKeys((prev) => ({
                                ...prev,
                                [product.id]: e.target.value,
                              }))
                            }
                            className="w-full border border-[#4b2e19]/20 rounded-lg px-2 py-1.5 text-[10px] md:text-sm text-[#2D2D2D] bg-white focus:outline-none focus:ring-2 focus:ring-[#f5d26a]/50 font-semibold"
                          >
                            {family.map((row) => {
                              const price = row.price - row.discount;
                              return (
                                <option
                                  key={familyVariantKey(row)}
                                  value={familyVariantKey(row)}
                                  disabled={row.stock <= 0}
                                >
                                  {formatVariantUnit(row.weight, "Ghee")} — ₹
                                  {price.toLocaleString("en-IN")}
                                  {row.stock <= 0 ? " (Out of stock)" : ""}
                                </option>
                              );
                            })}
                          </select>
                        )}

                        {family.length <= 1 && selected && (
                          <div className="flex items-center justify-between">
                            <span className="text-xs md:text-sm text-[#2D2D2D] font-bold">
                              {formatVariantUnit(selected.weight, "Ghee")}
                            </span>
                            {savings > 0 && (
                              <span className="bg-red-100 text-red-600 px-1.5 md:px-2.5 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-bold">
                                Save ₹{savings}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Price and Add to Cart */}
                        <div className="flex items-center -mx-2 md:-mx-4 -mb-2 md:-mb-4 bg-white shadow-sm rounded-full">
                          <div className="flex-1 flex items-center justify-between px-2 md:px-4 rounded-l-full ">
                            <div className="flex items-center gap-1.5 md:gap-3 flex-wrap h-full">
                              <div className="flex items-center gap-1 md:gap-2">
                                <span className="text-base md:text-2xl font-bold text-[#4b2e19]">₹{finalPrice.toLocaleString('en-IN')}</span>
                                {savings > 0 && (
                                  <span className="text-[10px] md:text-sm text-[#2D2D2D]/60 line-through font-semibold">₹{originalPrice.toLocaleString('en-IN')}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="btn-atc btn-atc--compact w-2/5 h-full rounded-r-full px-2 md:px-5 py-1.5 md:py-2.5 text-[10px] md:text-sm whitespace-nowrap"
                            onClick={() => {
                              if (selected) {
                                handleAddToCart(selected);
                              }
                            }}
                            disabled={cartLoading || !selected || selected.stock <= 0}
                          >
                            {cartLoading ? 'Adding...' : <span className="hidden md:inline">ADD TO CART</span>}
                            {!cartLoading && <span className="md:hidden">ADD</span>}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>

        {/* Why Our Ghee Section */}
        {/* <section className="py-16 md:py-20 bg-gradient-to-br bg-[#eef2e9]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-[Pacifico] text-[#4b2e19] mb-4">Why Choose Our Ghee?</h2>
              <p className="text-lg text-[#2D2D2D]/70 max-w-2xl mx-auto">
                Every jar of our ghee tells a story of tradition, purity, and uncompromising quality.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: "🏺",
                  title: "Traditional Bilona Method",
                  description: "Hand-churned using the ancient bilona technique, preserving authentic taste and nutrition."
                },
                {
                  icon: "🔬",
                  title: "Lab Tested Purity",
                  description: "Every batch undergoes rigorous testing to ensure 100% purity and quality standards."
                },
                {
                  icon: "🌾",
                  title: "Farm Fresh Milk",
                  description: "Sourced directly from small family farms, ensuring the freshest and highest quality milk."
                },
                {
                  icon: "✨",
                  title: "No Preservatives",
                  description: "Pure, natural ghee without any additives, chemicals, or preservatives."
                }
              ].map((item, idx) => (
                <div key={idx} className="text-center space-y-4 p-6 bg-white/50 rounded-2xl border border-[#4b2e19]/10">
                  <div className="text-5xl">{item.icon}</div>
                  <h3 className="text-xl font-bold text-[#4b2e19]">{item.title}</h3>
                  <p className="text-[#2D2D2D]/70 text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section> */}

         {/* Wave back to cream before Footer */}
         <div aria-hidden className="relative z-20 -mt-1 md:-mt-2 bg-[#fdf7f2]">
           <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block w-full h-[34px] md:h-[90px] text-[#eef2e9] fill-current">
             <path d="M0,40 C120,80 240,0 360,40 S600,80 720,40 960,0 1080,40 1320,80 1440,40 L1440,0 L0,0 Z"></path>
           </svg>
         </div>

         {/* CTA Section */}
         {/* <section className="py-16 md:py-20 bg-[#4b2e19]">
           <div className="container mx-auto px-4 text-center">
             <h2 className="text-4xl md:text-5xl font-[Pacifico] text-white mb-6">
               Ready to Experience Pure Ghee?
             </h2>
             <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
               Join thousands of satisfied customers who trust our traditional, pure ghee for their daily cooking.
             </p>
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <button className="bg-[#f5d26a] text-[#4b2e19] px-8 py-4 rounded-full font-bold text-lg hover:bg-[#e6b800] transition-colors duration-300 shadow-lg">
                 Shop All Ghee
               </button>
               <button className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-[#4b2e19] transition-colors duration-300">
                 Learn More
               </button>
             </div>
           </div>
         </section> */}
      </main>
      <Footer />
    </>
  );
}

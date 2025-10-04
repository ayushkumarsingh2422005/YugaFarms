'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import { useCart } from "@/app/context/CartContext";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:1337";

type ProductVariant = {
  id: number;
  Price: number;
  Discount: number;
  Weight: number;
  Stock: number;
};

type ProductTag = {
  id: number;
  Value: string;
};

type ProductImage = {
  id: number;
  url: string;
  alternativeText?: string;
};

type Product = {
  id: number;
  Title: string;
  Description: string;
  Rating: number;
  PunchLine: string;
  NumberOfPurchase: number;
  Type: "Ghee" | "Honey";
  Variants: ProductVariant[];
  Tags: ProductTag[];
  Image: ProductImage[];
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
};

export default function HoneyPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariants, setSelectedVariants] = useState<{[key: number]: number}>({});
  const { addToCart, isLoading: cartLoading, items: cartItems } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BACKEND}/api/products?filters[Type][$eq]=Honey&populate=*`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        setProducts(data.data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getProductEmoji = (title: string) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('wild') || titleLower.includes('forest')) return '🍯';
    if (titleLower.includes('acacia')) return '🌼';
    if (titleLower.includes('eucalyptus')) return '🌿';
    if (titleLower.includes('multi') || titleLower.includes('flower')) return '🌸';
    if (titleLower.includes('manuka')) return '👑';
    if (titleLower.includes('family') || titleLower.includes('pack')) return '👨‍👩‍👧‍👦';
    return '🍯';
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

  const getProductBadge = (index: number) => {
    const badges = ["Best Seller", "Popular", "Health", "Classic", "Premium", "Value"];
    return badges[index % badges.length];
  };

  const handleAddToCart = async (product: Product, variant: ProductVariant) => {
    try {
      await addToCart({
        productId: product.id,
        variantId: variant.id,
        price: variant.Price - (variant.Discount || 0),
        weight: variant.Weight,
        productTitle: product.Title,
        productImage: product.Image && product.Image.length > 0 ? `${BACKEND}${product.Image[0].url}` : undefined,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleVariantChange = (productId: number, variantId: number) => {
    setSelectedVariants(prev => ({
      ...prev,
      [productId]: variantId
    }));
  };

  const isItemInCart = (productId: number, variantId: number) => {
    return cartItems.some(item => item.productId === productId && item.variantId === variantId);
  };

  const getCartItemQuantity = (productId: number, variantId: number) => {
    const cartItem = cartItems.find(item => item.productId === productId && item.variantId === variantId);
    return cartItem ? cartItem.quantity : 0;
  };

  if (loading) {
    return (
      <>
        <TopBar />
        <main className="min-h-screen bg-gradient-to-br from-[#fdf7f2] via-[#f8f4e6] to-[#f0e6d2] relative overflow-hidden pt-20">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4b2e19] mx-auto mb-4"></div>
              <p className="text-[#4b2e19] text-lg">Loading our pure honey collection...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <TopBar />
        <main className="min-h-screen bg-gradient-to-br from-[#fdf7f2] via-[#f8f4e6] to-[#f0e6d2] relative overflow-hidden pt-20">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <p className="text-red-600 text-lg mb-4">Error: {error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-[#4b2e19] text-white px-6 py-2 rounded-lg hover:bg-[#2f4f2f] transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <TopBar />
      <main className="min-h-screen bg-gradient-to-br from-[#fdf7f2] via-[#f8f4e6] to-[#f0e6d2] relative overflow-hidden pt-20">
         {/* Hero Section */}
         <div className="relative pt-16 md:pt-20">
           <div className="container mx-auto px-4">
             <div className="text-center mb-10">
               <div className="inline-block relative">
                 <h1 className="text-5xl md:text-7xl font-[Pacifico] text-[#4b2e19] mb-4">
                   Pure <span className="text-[#f5d26a]">Honey</span> Collection
                 </h1>
                 <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-[#f5d26a] to-[#4b2e19] rounded-full"></div>
               </div>
               <p className="text-xl text-[#2D2D2D]/70 mt-6 max-w-3xl mx-auto">
                 Raw, unfiltered honey straight from nature&apos;s bounty. Experience the pure sweetness and health benefits of authentic honey.
               </p>
             </div>
           </div>
         </div>

         {/* Wave into Honey Products */}
         <div aria-hidden className="relative z-20 -mt-2">
           <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block w-full h-[70px] md:h-[90px] text-[#eef2e9] fill-current">
             <path d="M0,80 C120,40 240,120 360,80 S600,40 720,80 960,120 1080,80 1320,40 1440,80 L1440,120 L0,120 Z"></path>
           </svg>
         </div>

        {/* Honey Products Section */}
        <section className="py-16 md:py-20 bg-[#eef2e9]">
          <div className="container mx-auto px-4">

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-[#4b2e19] text-lg">No honey products available at the moment.</p>
                  <p className="text-[#2D2D2D]/70 mt-2">Please check back later or contact us for more information.</p>
                </div>
              ) : (
                products.map((product, idx) => {
                  const emoji = getProductEmoji(product.Title);
                  const gradient = getProductGradient(idx);
                  const badge = getProductBadge(idx);
                  const features = product.Tags.map(tag => tag.Value);
                  
                  // Calculate pricing from variants
                  const variants = product.Variants || [];
                  const hasVariants = variants.length > 0;
                  const selectedVariantId = selectedVariants[product.id] || variants[0]?.id;
                  const selectedVariant = variants.find(v => v.id === selectedVariantId) || variants[0];
                  const currentPrice = selectedVariant ? (selectedVariant.Price - (selectedVariant.Discount || 0)) : 0;
                  const originalPrice = selectedVariant ? selectedVariant.Price : 0;
                  const savings = selectedVariant ? (selectedVariant.Discount || 0) : 0;

                  return (
                    <div key={product.id} className="rounded-3xl border border-[#4b2e19]/15 bg-white shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden">
                      {/* Product Image - Clickable */}
                      <Link href={`/product/${product.id}`} className="block">
                        <div className={`relative h-64 bg-gradient-to-br ${gradient} rounded-t-3xl flex items-center justify-center overflow-hidden cursor-pointer`}>
                          {product.Image && product.Image.length > 0 ? (
                            <img 
                              src={`${BACKEND}${product.Image[0].url}`} 
                              alt={product.Image[0].alternativeText || product.Title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <>
                              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                              <span className="text-8xl relative z-10 drop-shadow-lg">{emoji}</span>
                            </>
                          )}
                          
                          {/* Badge */}
                          <div className="absolute top-4 left-4">
                            <div className="bg-white/90 backdrop-blur-sm text-[#4b2e19] px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                              {badge}
                            </div>
                          </div>
                          
                          {/* Rating Badge */}
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4 text-[#f5d26a]" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.176 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81H6.93a1 1 0 00.95-.69l1.07-3.292z"/>
                              </svg>
                              <span className="text-sm font-bold text-[#2D2D2D]">{product.Rating}</span>
                            </div>
                          </div>

                          {/* View Details Overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                              <span className="text-[#4b2e19] font-semibold text-sm">View Details</span>
                            </div>
                          </div>
                        </div>
                      </Link>

                      {/* Product Details */}
                      <div className="p-6 space-y-4">
                        {/* Title and Subtitle */}
                        <div>
                          <Link href={`/product/${product.id}`} className="block group">
                            <h3 className="text-2xl font-bold text-[#4b2e19] mb-1 group-hover:text-[#2f4f2f] transition-colors">{product.Title}</h3>
                          </Link>
                          <p className="text-[#2D2D2D]/60 text-sm font-medium">{product.PunchLine}</p>
                          {/* Limited description - just first 100 characters */}
                          <p className="text-[#2D2D2D]/70 text-sm mt-2 leading-relaxed">
                            {product.Description.length > 100 
                              ? `${product.Description.substring(0, 100)}...` 
                              : product.Description
                            }
                          </p>
                        </div>

                        {/* Rating and Sales */}
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <svg key={i} className="w-4 h-4 text-[#f5d26a]" fill={i < Math.floor(product.Rating) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.176 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81H6.93a1 1 0 00.95-.69l1.07-3.292z"/>
                                </svg>
                              ))}
                            </div>
                            <span className="text-[#2D2D2D]/70">({product.NumberOfPurchase} bought)</span>
                          </div>
                        </div>

                        {/* Price Range */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            {variants.length > 0 && (
                              <>
                                <span className="text-2xl font-bold text-[#4b2e19]">
                                  ₹{Math.min(...variants.map(v => v.Price - (v.Discount || 0)))}
                                </span>
                                {variants.length > 1 && (
                                  <span className="text-lg text-[#2D2D2D]/60">
                                    - ₹{Math.max(...variants.map(v => v.Price - (v.Discount || 0)))}
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                          <div className="text-sm text-[#2D2D2D]/70">
                            {variants.length > 1 ? `${variants.length} sizes available` : `${variants[0]?.Weight}g`}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <Link 
                            href={`/product/${product.id}`}
                            className="flex-1 bg-[#4b2e19] text-white py-3 rounded-xl font-semibold hover:bg-[#2f4f2f] transition-colors duration-300 shadow-lg hover:shadow-xl text-center"
                          >
                            View Details
                          </Link>
                          <button 
                            className="px-4 py-3 border-2 border-[#4b2e19] text-[#4b2e19] rounded-xl font-semibold hover:bg-[#4b2e19] hover:text-white transition-colors duration-300"
                            onClick={() => {
                              if (variants[0]) {
                                handleAddToCart(product, variants[0]);
                              }
                            }}
                            disabled={cartLoading || !hasVariants}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
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

        {/* Why Our Honey Section */}
        {/* <section className="py-16 md:py-20 bg-gradient-to-br bg-[#eef2e9]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-[Pacifico] text-[#4b2e19] mb-4">Why Choose Our Honey?</h2>
              <p className="text-lg text-[#2D2D2D]/70 max-w-2xl mx-auto">
                Every jar of our honey is a testament to nature&apos;s perfection and our commitment to purity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: "🐝",
                  title: "Raw & Unfiltered",
                  description: "Pure, raw honey straight from the hive, preserving all natural enzymes and health benefits."
                },
                {
                  icon: "🔬",
                  title: "Lab Tested Quality",
                  description: "Every batch undergoes rigorous testing to ensure purity, authenticity, and quality standards."
                },
                {
                  icon: "🌺",
                  title: "Single Source",
                  description: "Each honey variety comes from specific flower sources, ensuring consistent flavor and properties."
                },
                {
                  icon: "✨",
                  title: "No Additives",
                  description: "Pure, natural honey without any additives, preservatives, or artificial ingredients."
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
         <div aria-hidden className="relative z-20 -mt-2 bg-[#fdf7f2]">
           <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block w-full h-[70px] md:h-[90px] text-[#eef2e9] fill-current">
             <path d="M0,40 C120,80 240,0 360,40 S600,80 720,40 960,0 1080,40 1320,80 1440,40 L1440,0 L0,0 Z"></path>
           </svg>
         </div>
      </main>
      <Footer />
    </>
  );
}

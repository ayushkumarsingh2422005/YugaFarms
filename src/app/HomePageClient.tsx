
'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import { useCart } from "@/app/context/CartContext";
import Image from "next/image";
import { productDetailPath } from "@/lib/productSlug";
import type { BannerMedia, Client, Product, ProductVariant } from "@/lib/strapiPublic";
import { seoBannerImageAlt } from "@/lib/seo";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:1337";

function BannerCarousel({ bannerItems }: { bannerItems: BannerMedia[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [mouseStart, setMouseStart] = useState<number | null>(null);
  const [mouseEnd, setMouseEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying || bannerItems.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerItems.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, bannerItems.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false); // Pause auto-play when user manually navigates
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume after 10 seconds
  };

  // Minimum swipe distance (in pixels) to trigger slide change
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const currentTouch = e.targetTouches[0].clientX;
    setTouchEnd(currentTouch);
    // Prevent scrolling while swiping horizontally
    if (touchStart !== null) {
      const distance = Math.abs(touchStart - currentTouch);
      // Only prevent default if swiping horizontally (more horizontal than vertical)
      if (distance > 10) {
        e.preventDefault();
      }
    }
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && bannerItems.length > 1) {
      // Swipe left - go to next slide
      setCurrentIndex((prev) => (prev + 1) % bannerItems.length);
      setIsAutoPlaying(false);
      setTimeout(() => setIsAutoPlaying(true), 10000);
    }

    if (isRightSwipe && bannerItems.length > 1) {
      // Swipe right - go to previous slide
      setCurrentIndex((prev) => (prev - 1 + bannerItems.length) % bannerItems.length);
      setIsAutoPlaying(false);
      setTimeout(() => setIsAutoPlaying(true), 10000);
    }

    // Reset touch positions
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Mouse drag handlers for desktop - global listeners for smooth dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setMouseEnd(e.clientX);
    };

    const handleMouseUp = () => {
      if (!isDragging) return;

      if (mouseStart !== null && mouseEnd !== null) {
        const distance = mouseStart - mouseEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe && bannerItems.length > 1) {
          // Swipe left - go to next slide
          setCurrentIndex((prev) => (prev + 1) % bannerItems.length);
          setIsAutoPlaying(false);
          setTimeout(() => setIsAutoPlaying(true), 10000);
        }

        if (isRightSwipe && bannerItems.length > 1) {
          // Swipe right - go to previous slide
          setCurrentIndex((prev) => (prev - 1 + bannerItems.length) % bannerItems.length);
          setIsAutoPlaying(false);
          setTimeout(() => setIsAutoPlaying(true), 10000);
        }
      }

      // Reset mouse positions
      setIsDragging(false);
      setMouseStart(null);
      setMouseEnd(null);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      // Prevent text selection while dragging
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
    };
  }, [isDragging, mouseStart, mouseEnd, bannerItems.length]);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setMouseEnd(null);
    setMouseStart(e.clientX);
  };

  if (bannerItems.length === 0) {
    return null;
  }

  const currentItem = bannerItems[currentIndex];
  const isVideo = currentItem.mime?.startsWith('video/');

  return (
    <div
      className="relative w-full aspect-[3/2] md:aspect-[1200/400] overflow-hidden touch-pan-y select-none cursor-grab active:cursor-grabbing"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
    >
      {/* Media Display */}
      <div className="relative w-full h-full">
        {isVideo ? (
          <video
            key={currentItem.id}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-[center_20%] md:object-center"
          >
            <source src={`${BACKEND}${currentItem.url}`} type={currentItem.mime} />
            Your browser does not support the video tag.
          </video>
        ) : (
          <Image
            src={`${BACKEND}${currentItem.url}`}
            alt={seoBannerImageAlt(currentItem)}
            fill
            className="object-cover object-[center_20%] md:object-center"
            priority={currentIndex === 0}
            sizes="100vw"
          />
        )}
      </div>

      {/* Dots Indicator */}
      {bannerItems.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {bannerItems.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/75 w-2'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar (for auto-play) */}
      {bannerItems.length > 1 && isAutoPlaying && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-10">
          <div
            className="h-full bg-white/60 transition-all duration-100"
            style={{
              width: `${((currentIndex + 1) / bannerItems.length) * 100}%`,
            }}
          />
        </div>
      )}
    </div>
  );
};

type HomePageClientProps = {
  bannerItems: BannerMedia[];
  topProducts: Product[];
  clients: Client[];
};

export default function HomePageClient({
  bannerItems,
  topProducts,
  clients,
}: HomePageClientProps) {
  const { addToCart, isLoading: cartLoading } = useCart();
  const [selectedVariants, setSelectedVariants] = useState<Record<number, number>>(() => {
    const m: Record<number, number> = {};
    topProducts.forEach((product) => {
      if (product.Variants?.length) m[product.id] = product.Variants[0].id;
    });
    return m;
  });

  const getProductEmoji = (title: string, type: string) => {
    const titleLower = title.toLowerCase();
    if (type === "Ghee") {
      if (titleLower.includes('a2') || titleLower.includes('desi')) return '🧈';
      if (titleLower.includes('classic') || titleLower.includes('cow')) return '🐄';
      if (titleLower.includes('buffalo')) return '🥛';
      if (titleLower.includes('organic')) return '🌿';
      if (titleLower.includes('spiced') || titleLower.includes('spice')) return '🌶️';
      if (titleLower.includes('family') || titleLower.includes('pack')) return '👨‍👩‍👧‍👦';
      return '🧈';
    } else if (type === "Honey") {
      if (titleLower.includes('wild') || titleLower.includes('forest')) return '🍯';
      if (titleLower.includes('acacia')) return '🌼';
      if (titleLower.includes('eucalyptus')) return '🌿';
      if (titleLower.includes('multi') || titleLower.includes('flower')) return '🌸';
      if (titleLower.includes('manuka')) return '👑';
      if (titleLower.includes('family') || titleLower.includes('pack')) return '👨‍👩‍👧‍👦';
      return '🍯';
    }
    return '🥜'; // Default for oils
  };

  const getProductBadge = (index: number) => {
    const badges = ["Best Seller", "Popular", "Premium", "New", "Family Pack", "Value"];
    return badges[index % badges.length];
  };

  const formatVolume = (ml: number): string => {
    if (ml >= 1000) {
      const liters = ml / 1000;
      return liters % 1 === 0 ? `${liters} L` : `${liters.toFixed(1)} L`;
    }
    return `${ml} ml`;
  };

  const formatWeight = (grams: number): string => {
    if (grams >= 1000) {
      const kg = grams / 1000;
      return kg % 1 === 0 ? `${kg} kg` : `${kg.toFixed(1)} kg`;
    }
    return `${grams} gram`;
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
  return (
    <>
      <TopBar />
      <main className="relative">
        {/* Banner Carousel - Full Screen */}
        <BannerCarousel bannerItems={bannerItems} />
      </main>

      {/* Wave into Our Top Picks */}
      <div className="container mx-auto px-4 -mt-20 md:mt-0 py-2 text-center bg-[#eef2e9] flex flex-col gap-1 relative z-10 pt-6">
        <h1 className="m-0 text-2xl md:text-3xl font-bold text-[#4b2e19]">Welcome To YugaFarms!</h1>
        <p className="m-0 text-lg md:text-xl text-[#2D2D2D]/70">You're One Step Closer to Purity</p>
      </div>
      {/* Our Top Picks (soft sage background) */}
      <div className="bg-[#eef2e9] py-6">
        <section className="relative z-30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="relative">
                <h2 className="text-2xl md:text-3xl font-bold text-[#4b2e19]">Our Top Picks</h2>
                <div className="absolute -bottom-1 left-0 w-16 h-0.5 bg-[#f5d26a] rounded-full"></div>
              </div>
              <Link
                href="/ghee"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#4b2e19] px-4 py-2.5 text-sm font-semibold text-white shadow-md ring-2 ring-[#4b2e19]/20 ring-offset-2 ring-offset-[#eef2e9] transition-all duration-300 hover:bg-[#2f4f2f] hover:shadow-lg hover:ring-[#f5d26a]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5d26a] focus-visible:ring-offset-2"
              >
                View all
                <span aria-hidden className="text-[#f5d26a]">→</span>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              {topProducts.length === 0 ? (
                // No products state
                <div className="col-span-full text-center py-12">
                  <p className="text-[#4b2e19] text-lg">No products available at the moment.</p>
                  <p className="text-[#2D2D2D]/70 mt-2">Please check back later.</p>
                </div>
              ) : (
                topProducts.map((product, idx) => {
                  const emoji = getProductEmoji(product.Title, product.Type);
                  const badge = getProductBadge(idx);

                  // Calculate pricing from variants
                  const variants = product.Variants || [];
                  const hasVariants = variants.length > 0;
                  const selectedVariantId = selectedVariants[product.id];
                  const selectedVariant = variants.find(v => v.id === selectedVariantId) || variants[0];

                  const handleVariantChange = (variantId: number) => {
                    setSelectedVariants(prev => ({
                      ...prev,
                      [product.id]: variantId
                    }));
                  };

                  const finalPrice = selectedVariant ? selectedVariant.Price - (selectedVariant.Discount || 0) : 0;
                  const originalPrice = selectedVariant ? selectedVariant.Price : 0;
                  const savings = originalPrice - finalPrice;

                  return (
                    <div key={product.id} className="rounded-xl md:rounded-2xl transition-all duration-300 group">
                      {/* Product Image */}
                      <Link href={productDetailPath(product)} className="block">
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
                          <div className="absolute top-1.5 left-1.5 md:top-3 md:left-3">
                            <div className="text-[10px] md:text-xs bg-[#f5d26a] text-[#4b2e19] px-1.5 md:px-2 py-0.5 md:py-1 rounded-full font-semibold">{badge}</div>
                          </div>
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
                          <Link href={productDetailPath(product)} className="block group">
                            <h3 className="text-xs md:text-base font-bold text-[#2D2D2D] mb-0.5 md:mb-1 group-hover:text-[#4b2e19] transition-colors line-clamp-2 leading-tight">{product.Title}</h3>
                          </Link>
                          <p className="text-[10px] md:text-xs text-[#2D2D2D]/70 font-semibold line-clamp-1 mt-0.5">{product.PunchLine}</p>
                        </div>

                        {/* Weight and Savings Display */}
                        {selectedVariant && (
                          <div className="flex items-center justify-between">
                            <span className="text-xs md:text-sm text-[#2D2D2D] font-bold">
                              {product.Type === "Ghee"
                                ? formatVolume(selectedVariant.Weight)
                                : formatWeight(selectedVariant.Weight)}
                            </span>
                            {savings > 0 && (
                              <span className="bg-red-100 text-red-600 px-1.5 md:px-2.5 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-bold">
                                Save ₹{savings}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Dropdown and Add to Cart */}
                        <div className="flex items-center">
                          {/* Variant Dropdown (replaces price section, shows pricing) */}
                          {hasVariants && (
                            <select
                              value={selectedVariantId || variants[0]?.id}
                              onChange={(e) => handleVariantChange(Number(e.target.value))}
                              className="border border-r-0 border-[#4b2e19]/20 rounded-l-full px-2 md:px-4 py-1.5 md:py-2.5 text-[10px] md:text-sm text-[#2D2D2D] bg-white focus:outline-none focus:ring-2 focus:ring-[#f5d26a]/50 focus:border-[#f5d26a] cursor-pointer shadow-sm font-semibold w-full"
                            >
                              {variants.map((variant) => {
                                const variantPrice = variant.Price - (variant.Discount || 0);
                                const variantOriginalPrice = variant.Price;
                                const variantSavings = variantOriginalPrice - variantPrice;
                                const weightDisplay = product.Type === "Ghee"
                                  ? formatVolume(variant.Weight)
                                  : formatWeight(variant.Weight);
                                return (
                                  <option key={variant.id} value={variant.id}>
                                    {weightDisplay} - ₹{variantPrice.toLocaleString('en-IN')}
                                    {variantSavings > 0 && ` (Save ₹${variantSavings.toLocaleString('en-IN')})`}
                                    {variant.Stock <= 0 && ' - Out of Stock'}
                                  </option>
                                );
                              })}
                            </select>
                          )}

                          {/* Add to Cart Button */}
                          <button
                            className="bg-[#2f4f2f] text-white text-[10px] md:text-sm px-2 md:px-5 py-1.5 md:py-2.5 rounded-r-full hover:bg-[#3d6d3d] transition-colors duration-200 font-bold disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shadow-md"
                            onClick={() => {
                              if (selectedVariant) {
                                handleAddToCart(product, selectedVariant);
                              }
                            }}
                            disabled={cartLoading || !hasVariants || !selectedVariant || (selectedVariant.Stock <= 0)}
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
      </div>

      {/* Why Choose YugaFarms */}
      <section className="relative z-30 overflow-hidden bg-[#4b2e19] py-12 md:py-16">
        <img
          aria-hidden
          src="/images/why%20yugafarms.png"
          alt=""
          className="pointer-events-none absolute bottom-0 left-0 w-full select-none opacity-[0.32] mix-blend-soft-light"
          style={{
            filter:
              "sepia(1) hue-rotate(302deg) saturate(0.4) brightness(0.5) contrast(0.85)",
          }}
        />
        
        <div className="container relative z-10 mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">WHY YUGAFARMS?</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
              {[
                {
                  title: "100% Pure",
                  icon: "/images/pure.png"
                },
                {
                  title: "Farm Fresh",
                  icon: "/images/farmfresh.png"
                },
                {
                  title: "Made in Small Batches",
                  icon: "/images/madeinsmallbatches.png"
                },
                {
                  title: "Rooted in Tradition",
                  icon: "/images/rootedintradition.png"
                },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center text-center group">
                  <div className="w-28 h-28 md:w-32 md:h-32 border-2 border-transparent flex items-center justify-center mb-3 text-white transition-all duration-300 group-hover:scale-105 bg-red"
                    style={{
                      backgroundImage: `url(${item.icon})`,
                      backgroundSize: '100% 100%',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
                  >
                  </div>
                  <span className="text-white text-xs md:text-sm font-medium transition-colors duration-300 group-hover:text-[#f5d26a]">{item.title}</span>
                </div>
              ))}
            </div>

            <Link href="/about" className="bg-white text-[#4b2e19] px-6 py-2.5 rounded-full font-semibold text-base hover:bg-gray-100 transition-all duration-300 hover:scale-105">
              OUR STORY
            </Link>
          </div>
        </div>
      </section>

      {/* Client Reviews */}
      <section className="bg-[#f5f5f5] py-14 md:py-20">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <h2 className="mb-10 text-center text-2xl font-bold text-[#1e293b] md:mb-12 md:text-[32px]">
            What Do Our Customers Say
          </h2>

          <TestimonialsCarousel clients={clients} />
        </div>
      </section>


      {/* Tradition Banner - Creative Heritage Showcase */}
      <section className="relative pb-20 md:pb-24 bg-gradient-to-br from-[#fdf7f2] via-[#f8f4e6] to-[#f0e6d2] overflow-hidden">
        {/* Wave back to cream before Footer */}
        <div aria-hidden className="relative z-20 mb-10">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block w-full h-[70px] md:h-[90px] text-[#f5f5f5] fill-current">
            <path d="M0,40 C120,80 240,0 360,40 S600,80 720,40 960,0 1080,40 1320,80 1440,40 L1440,0 L0,0 Z"></path>
          </svg>
        </div>
        {/* Organic background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-[#f5d26a]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#4b2e19]/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#2f4f2f]/5 rounded-full blur-2xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block relative">
              <h2 className="text-4xl md:text-5xl font-[Pacifico] text-[#4b2e19] mb-4">Rooted in Ancient Wisdom</h2>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-[#f5d26a] to-[#4b2e19] rounded-full"></div>
            </div>
            <p className="text-lg text-[#2D2D2D]/70 mt-6 max-w-3xl mx-auto">
              Crafted the slow way, just like our grandmothers did — with patience, care, and respect for the land.
            </p>
          </div>

          {/* Tradition showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl">
                    <Image src="/images/bilona.png" alt="Bilona" width={48} height={48} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#4b2e19] mb-2">Bilona-Churned Excellence</h3>
                    <p className="text-[#2D2D2D]/70 leading-relaxed">Our ghee is made using the traditional bilona method — a slow, patient process that preserves every ounce of nutrition and flavor.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl">
                    <Image src="/images/leaf.png" alt="Cold Pressed" width={48} height={48} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#4b2e19] mb-2">Cold-Pressed Purity</h3>
                    <p className="text-[#2D2D2D]/70 leading-relaxed">No heat, no chemicals, no compromise. Our oils retain their natural goodness through gentle cold-pressing.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl">
                    <Image src="/images/farm.png" alt="Farm" width={48} height={48} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#4b2e19] mb-2">Farm-to-Table Freshness</h3>
                    <p className="text-[#2D2D2D]/70 leading-relaxed">Directly sourced from small family farms, ensuring maximum freshness and supporting local communities.</p>
                  </div>
                </div>
              </div>

              {/* Tradition badges */}
              <div className="flex flex-wrap gap-4 pt-6">
                <div className="bg-[#f5d26a] text-[#4b2e19] px-6 py-3 rounded-full font-semibold flex items-center gap-2">
                  <Image src="/images/bilona.png" alt="Bilona" width={24} height={24} className="h-[20px] object-contain" /> Bilona-churned
                </div>
                <div className="bg-[#4b2e19] text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2">
                  <Image src="/images/leaf.png" alt="Cold Pressed" width={24} height={24} className="h-[20px] object-contain" /> Cold-pressed
                </div>
                <div className="bg-white border-2 border-[#4b2e19] text-[#4b2e19] px-6 py-3 rounded-full font-semibold flex items-center">
                  <Image src="/images/farm.png" alt="Farm" width={24} height={24} className="h-[20px] object-contain" /> No preservatives
                </div>
              </div>
            </div>

            {/* Right side - Visual */}
            <div className="relative">
              <div className="relative">
                <Image src="/images/tradition.png" alt="Tradition" width={600} height={600} className="w-[90%] h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications & Compliance Section */}
      <section className="py-12 md:py-16 bg-white border-t border-[#eef2e9] relative z-30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-block relative">
              <h2 className="text-2xl md:text-3xl font-bold text-[#4b2e19] mb-2">Certified Quality & Safety</h2>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-[#f5d26a] rounded-full"></div>
            </div>
            <p className="text-[#2D2D2D]/70 max-w-2xl mx-auto mt-4 text-sm md:text-base">
              We adhere to the highest global standards to ensure every product you receive is pure, safe, and of exceptional quality.
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
            {[
              { name: "ISO", sub: "9001:2015", desc: "Quality Management", img: "/cert/iso.png" },
              { name: "FSSAI", sub: "Certified", desc: "Food Safety Standard", img: "/cert/fssai.png" },
              { name: "FDA", sub: "Registered", desc: "Compliant Facility", img: "/cert/fda.png" },
              { name: "GMP", sub: "Certified", desc: "Good Manufacturing", img: "/cert/gmp.png" },
              { name: "HACCP", sub: "Compliant", desc: "Hazard Control", img: "/cert/haccp.png" }
            ].map((cert, idx) => (
              <div key={idx} className="flex flex-col items-center group">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-[#fdf7f2] to-white border border-[#eef2e9] shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center mb-3">
                  <Image src={cert.img} alt={cert.name} width={48} height={48} className="w-full h-full object-contain" />
                </div>
                <span className="text-xs md:text-sm font-semibold text-[#2D2D2D]/80 text-center">
                  {cert.name}
                  <br />
                  {cert.sub}
                  {/* {cert.desc} */}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
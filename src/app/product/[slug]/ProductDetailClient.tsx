'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";
import { formatInr } from "@/lib/currency";
import { trackViewItem } from "@/lib/gtag";
import SimilarProducts from "@/components/SimilarProducts";
import type { Product, ProductComment, ProductVariant } from "@/lib/strapiPublic";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:1337";

export default function ProductDetailClient({
  initialProduct,
  similarProducts = [],
  productComments = [],
}: {
  initialProduct: Product | null;
  similarProducts?: Product[];
  productComments?: ProductComment[];
}) {
  const router = useRouter();
  const { user, jwt } = useAuth();
  const [product, setProduct] = useState<Product | null>(initialProduct);
  const [comments, setComments] = useState<ProductComment[]>(productComments);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState<number>(5);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editCommentText, setEditCommentText] = useState("");
  const [editRating, setEditRating] = useState<number>(5);
  const [isUpdatingComment, setIsUpdatingComment] = useState(false);
  const [isDeletingCommentId, setIsDeletingCommentId] = useState<number | null>(null);
  const [ratingAvg, setRatingAvg] = useState<number>(initialProduct?.Rating ?? 0);
  const [ratingCount, setRatingCount] = useState<number>(initialProduct?.NumberOfPurchase ?? 0);
  const [commentStatus, setCommentStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(
    initialProduct ? null : "Product not found"
  );
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    initialProduct?.Variants?.length ? initialProduct.Variants[0] : null
  );
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const { addToCart, isLoading: cartLoading, items: cartItems, setIsCartOpen } = useCart();

  useEffect(() => {
    setProduct(initialProduct);
    setComments(productComments);
    setNewComment("");
    setNewRating(5);
    setEditingCommentId(null);
    setEditCommentText("");
    setEditRating(5);
    setRatingAvg(initialProduct?.Rating ?? 0);
    setRatingCount(initialProduct?.NumberOfPurchase ?? 0);
    setCommentStatus(null);
    setError(initialProduct ? null : "Product not found");
    setSelectedImageIndex(0);
    if (initialProduct?.Variants?.length) {
      setSelectedVariant(initialProduct.Variants[0]);
    } else {
      setSelectedVariant(null);
    }
  }, [initialProduct]);

  useEffect(() => {
    if (!product) return;
    const likedProducts = JSON.parse(localStorage.getItem("likedProducts") || "{}");
    setIsLiked(!!likedProducts[String(product.id)]);
  }, [product?.id]);

  useEffect(() => {
    if (!product) return;
    const w = window as unknown as { fbq?: (...a: unknown[]) => void };
    if (typeof window !== "undefined" && w.fbq) {
      w.fbq("track", "ViewContent", {
        content_name: product.Title,
        content_ids: [String(product.id)],
        content_type: "product",
        value: product.Variants?.[0]?.Price ?? 0,
        currency: "INR",
      });
    }
  }, [product]);

  useEffect(() => {
    if (!product || !selectedVariant) return;
    const price = selectedVariant.Price - (selectedVariant.Discount || 0);
    trackViewItem({
      item_id: `${product.id}_${selectedVariant.id}`,
      item_name: product.Title,
      item_variant: String(selectedVariant.Weight),
      price,
      quantity: 1,
    });
  }, [product, selectedVariant]);

  useEffect(() => {
    const loadComments = async () => {
      if (!product) return;
      try {
        const url = `${BACKEND}/api/comments?filters[$or][0][Type][$eq]=Common&filters[$or][1][Type][$eq]=${product.Type}&sort=createdAt:desc&populate[user][fields][0]=id&populate[user][fields][1]=username`;
        const headers: Record<string, string> = {};
        if (jwt) {
          headers.Authorization = `Bearer ${jwt}`;
        }
        const res = await fetch(url, { cache: "no-store", headers });
        if (!res.ok) return;
        const data = (await res.json()) as { data?: ProductComment[] };
        const next = (data.data ?? []).filter((row) => Boolean(row?.Comment?.trim()));
        setComments(next);
      } catch {
        // Keep existing state silently on fetch failure.
      }
    };

    void loadComments();
  }, [product?.Type, jwt]);

  const submitComment = async () => {
    if (!product) return;
    const comment = newComment.trim();
    if (!comment) {
      setCommentStatus("Please write your comment first.");
      return;
    }
    if (!jwt) {
      setCommentStatus("Please login to add a comment.");
      return;
    }

    setIsSubmittingComment(true);
    setCommentStatus(null);
    try {
      const res = await fetch(`${BACKEND}/api/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          data: {
            Comment: comment,
            Type: product.Type,
            Rating: newRating,
          },
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || "Failed to submit comment");
      }

      const created = (await res.json()) as { data?: ProductComment };
      if (created?.data) {
        setComments((prev) => [created.data!, ...prev]);
      }
      setRatingAvg((prevAvg) => {
        const safeCount = Math.max(0, ratingCount);
        return safeCount === 0 ? newRating : (prevAvg * safeCount + newRating) / (safeCount + 1);
      });
      setRatingCount((prev) => prev + 1);
      setNewComment("");
      setNewRating(5);
      setCommentStatus("Comment posted successfully.");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to submit comment";
      setCommentStatus(msg);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const startEditComment = (row: ProductComment) => {
    setEditingCommentId(row.id);
    setEditCommentText(row.Comment ?? "");
    setEditRating(typeof row.Rating === "number" ? Math.round(row.Rating) : 5);
    setCommentStatus(null);
  };

  const isCommentOwner = (row: ProductComment) => {
    if (!user?.id || !row.user?.id) return false;
    return String(row.user.id) === String(user.id);
  };

  const cancelEditComment = () => {
    setEditingCommentId(null);
    setEditCommentText("");
    setEditRating(5);
  };

  const updateComment = async () => {
    if (!jwt || !editingCommentId) {
      setCommentStatus("Please login to edit your comment.");
      return;
    }
    const text = editCommentText.trim();
    if (!text) {
      setCommentStatus("Comment cannot be empty.");
      return;
    }

    setIsUpdatingComment(true);
    setCommentStatus(null);
    try {
      const res = await fetch(`${BACKEND}/api/comments/${editingCommentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          data: {
            Comment: text,
            Rating: editRating,
          },
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || "Failed to update comment");
      }

      const updated = (await res.json()) as { data?: ProductComment };
      if (updated?.data) {
        const oldRow = comments.find((row) => row.id === editingCommentId);
        const oldRating = typeof oldRow?.Rating === "number" ? oldRow.Rating : null;
        setComments((prev) => prev.map((row) => (row.id === updated.data!.id ? updated.data! : row)));
        if (typeof oldRating === "number" && oldRating !== editRating && ratingCount > 0) {
          setRatingAvg((prevAvg) => {
            const total = prevAvg * ratingCount - oldRating + editRating;
            return total / ratingCount;
          });
        }
      }
      setCommentStatus("Review updated successfully.");
      cancelEditComment();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to update comment";
      setCommentStatus(msg);
    } finally {
      setIsUpdatingComment(false);
    }
  };

  const deleteComment = async (row: ProductComment) => {
    if (!jwt) {
      setCommentStatus("Please login to delete your comment.");
      return;
    }
    if (!isCommentOwner(row)) {
      setCommentStatus("You can delete only your own comment.");
      return;
    }

    setIsDeletingCommentId(row.id);
    setCommentStatus(null);
    try {
      const res = await fetch(`${BACKEND}/api/comments/${row.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${jwt}` },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || "Failed to delete comment");
      }

      setComments((prev) => prev.filter((c) => c.id !== row.id));
      if (ratingCount > 0 && typeof row.Rating === "number") {
        const removedRating = row.Rating;
        setRatingAvg((prevAvg) => {
          if (ratingCount <= 1) return product?.Rating ?? 0;
          const total = prevAvg * ratingCount - removedRating;
          return total / (ratingCount - 1);
        });
        setRatingCount((prev) => Math.max(0, prev - 1));
      }
      if (editingCommentId === row.id) {
        cancelEditComment();
      }
      setCommentStatus("Review deleted successfully.");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to delete comment";
      setCommentStatus(msg);
    } finally {
      setIsDeletingCommentId(null);
    }
  };

  const toggleLike = () => {
    if (!product) return;

    const newLikedState = !isLiked;
    setIsLiked(newLikedState);

    const likedProducts = JSON.parse(localStorage.getItem('likedProducts') || '{}');
    if (newLikedState) {
      likedProducts[product.id] = true;
    } else {
      delete likedProducts[product.id];
    }
    localStorage.setItem('likedProducts', JSON.stringify(likedProducts));
  };

  const handleAddToCart = async () => {
    if (!product || !selectedVariant) return;

    try {
      await addToCart({
        productId: product.id,
        variantId: selectedVariant.id,
        price: selectedVariant.Price - (selectedVariant.Discount || 0),
        weight: selectedVariant.Weight,
        productTitle: product.Title,
        productImage: product.Image && product.Image.length > 0 ? `${BACKEND}${product.Image[0].url}` : undefined,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleBuyNow = async () => {
    if (!product || !selectedVariant) return;

    try {
      setIsCartOpen(false);
      await addToCart(
        {
          productId: product.id,
          variantId: selectedVariant.id,
          price: selectedVariant.Price - (selectedVariant.Discount || 0),
          weight: selectedVariant.Weight,
          productTitle: product.Title,
          productImage: product.Image && product.Image.length > 0 ? `${BACKEND}${product.Image[0].url}` : undefined,
        },
        { openCart: false }
      );

      router.push('/checkout');
    } catch (error) {
      console.error("Error during buy now:", error);
    }
  };

  const isItemInCart = () => {
    if (!product || !selectedVariant) return false;
    return cartItems.some(item => item.productId === product.id && item.variantId === selectedVariant.id);
  };

  const getCartItemQuantity = () => {
    if (!product || !selectedVariant) return 0;
    const cartItem = cartItems.find(item => item.productId === product.id && item.variantId === selectedVariant.id);
    return cartItem ? cartItem.quantity : 0;
  };

  const getProductEmoji = (title: string, type: string) => {
    const titleLower = title.toLowerCase();
    if (type === "Ghee") {
      if (titleLower.includes("a2") || titleLower.includes("desi")) return "\u{1F9C8}";
      if (titleLower.includes("classic") || titleLower.includes("cow")) return "\u{1F404}";
      if (titleLower.includes("buffalo")) return "\u{1F95B}";
      if (titleLower.includes("organic")) return "\u{1F33F}";
      if (titleLower.includes("spiced") || titleLower.includes("spice")) return "\u{1F336}\u{FE0F}";
      if (titleLower.includes("family") || titleLower.includes("pack")) return "\u{1F46A}";
      return "\u{1F9C8}";
    }
    if (titleLower.includes("wild") || titleLower.includes("forest")) return "\u{1F36F}";
    if (titleLower.includes("acacia")) return "\u{1F33C}";
    if (titleLower.includes("eucalyptus")) return "\u{1F33F}";
    if (titleLower.includes("multi") || titleLower.includes("flower")) return "\u{1F338}";
    if (titleLower.includes("manuka")) return "\u{1F451}";
    if (titleLower.includes("family") || titleLower.includes("pack")) return "\u{1F46A}";
    return "\u{1F36F}";
  };

  const getProductGradient = (type: string) => {
    if (type === "Ghee") {
      return "from-[#f5d26a] to-[#e6b800]";
    } else {
      return "from-[#f5d26a] to-[#e6b800]";
    }
  };

  const formatUnit = (weight: number, type: string) => {
    if (type === "Ghee") {
      if (weight >= 1000) {
        const liters = weight / 1000;
        return liters % 1 === 0 ? `${liters} L` : `${liters.toFixed(1)} L`;
      }
      return `${weight} ml`;
    } else {
      if (weight >= 1000) {
        const kg = weight / 1000;
        return kg % 1 === 0 ? `${kg} kg` : `${kg.toFixed(1)} kg`;
      }
      return `${weight} g`;
    }
  };

  if (error || !product) {
    return (
      <>
        <TopBar />
        <main className="min-h-screen bg-[#fdfbf7] relative overflow-hidden pt-3 md:pt-4">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <p className="text-red-600 text-lg mb-4">Error: {error || 'Product not found'}</p>
              <button
                onClick={() => router.back()}
                className="bg-[#4b2e19] text-white px-6 py-2 rounded-lg hover:bg-[#2f4f2f] transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const currentPrice = selectedVariant ? (selectedVariant.Price - (selectedVariant.Discount || 0)) : 0;
  const originalPrice = selectedVariant ? selectedVariant.Price : 0;
  const savings = selectedVariant ? (selectedVariant.Discount || 0) : 0;
  const emoji = getProductEmoji(product.Title, product.Type);
  const itemInCart = isItemInCart();
  const cartQuantity = getCartItemQuantity();
  const ctaAttentionClass = "cta-wiggle";
  const ratedComments = comments.filter((c) => typeof c.Rating === "number");
  const averageRating = ratingCount > 0 ? ratingAvg : product.Rating;
  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => {
    const count = ratedComments.filter((c) => Math.round(c.Rating as number) === star).length;
    const percent = ratedComments.length ? Math.round((count / ratedComments.length) * 100) : 0;
    return { star, count, percent };
  });

  return (
    <>
      <TopBar />
      <main className="min-h-screen bg-[#fdfbf7] relative overflow-hidden pt-3 md:pt-4">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 pt-0">
          <nav className="flex items-center space-x-2 text-sm text-[#2D2D2D]/70 mb-0 w-full overflow-hidden">
            <Link href="/" className="hover:text-[#4b2e19] transition-colors shrink-0 whitespace-nowrap">Home</Link>
            <span className="shrink-0">/</span>
            <Link href={`/${product.Type.toLowerCase()}`} className="hover:text-[#4b2e19] transition-colors capitalize shrink-0 whitespace-nowrap">
              {product.Type}
            </Link>
            <span className="shrink-0">/</span>
            <span className="text-[#4b2e19] font-medium truncate min-w-0">{product.Title}</span>
          </nav>
        </div>

        {/* Product Detail Section */}
        <section className="py-2 md:py-4">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
              {/* Product Images */}
              <div className="flex flex-col gap-3 md:gap-4">
                {/* Main Image */}
                <div className="relative w-full rounded-2xl flex items-center justify-center overflow-hidden aspect-square bg-[#f5f2ea] shadow-[0_8px_32px_rgba(75,46,25,0.08)]">
                  {product.Image && product.Image.length > 0 ? (
                    <Image
                      src={`${BACKEND}${product.Image[selectedImageIndex].url}`}
                      alt={product.Image[selectedImageIndex].alternativeText || product.Title}
                      width={800}
                      height={800}
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="w-full h-full object-cover aspect-square"
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                      <span className="text-9xl relative z-10 drop-shadow-lg">{emoji}</span>
                    </>
                  )}

                  {/* Rating Badge */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-[0_2px_12px_rgba(0,0,0,0.08)]">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#f5d26a]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.176 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81H6.93a1 1 0 00.95-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-lg font-bold text-[#2D2D2D]">{product.Rating}</span>
                    </div>
                  </div>
                </div>

                {/* Thumbnail Images */}
                {product.Image && product.Image.length > 0 && (
                  <div className="flex gap-4 flex-row overflow-x-auto pb-2 custom-scrollbar snap-x snap-mandatory">
                    {product.Image.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative h-20 shrink-0 snap-start rounded-lg overflow-hidden border transition-all aspect-square ${selectedImageIndex === index
                          ? 'border-[#4b2e19] ring-1 ring-[#4b2e19]/20'
                          : 'border-[#e8e4dc] hover:border-[#4b2e19]/40'
                          }`}
                      >
                        <Image
                          src={`${BACKEND}${image.url}`}
                          alt={image.alternativeText || `${product.Title} ${index + 1}`}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Information */}
              <div className="flex flex-col gap-4">
                {/* Title, Rating, and Price Details */}
                <div>
                  <h1 className="text-2xl md:text-[2rem] font-bold text-[#4b2e19] mb-2 leading-tight">{product.Title}</h1>
                  {product.PunchLine && (
                    <p className="text-xs md:text-sm uppercase tracking-wider text-[#2D2D2D]/55 font-medium mb-2">{product.PunchLine}</p>
                  )}

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-[2px]">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} className={`w-4 h-4 md:w-[18px] md:h-[18px] ${i < Math.floor(product.Rating) ? 'text-[#f5d26a]' : 'text-[#D1D1D1]'} fill-current`} viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs md:text-sm font-bold text-[#2D2D2D] ml-1">{product.Rating}</span>
                    <span className="text-[#2D2D2D]/30 mx-1">|</span>
                    <span className="text-xs md:text-sm font-medium text-[#2D2D2D]/70">{product.NumberOfPurchase} Reviews</span>
                  </div>

                  {/* Price Block */}
                  <div>
                    <div className="flex items-end gap-3 mb-1">
                      <span className="text-[28px] md:text-3xl font-bold text-[#2D2D2D] leading-none">{formatInr(currentPrice)}</span>
                      {originalPrice > currentPrice && (
                        <span className="text-lg text-[#2D2D2D]/50 line-through mb-0.5">{formatInr(originalPrice)}</span>
                      )}
                    </div>
                    <p className="text-xs md:text-[13px] text-[#2D2D2D]/60 mb-2">MRP (incl. of all taxes)</p>

                    <span className="inline-block rounded-full bg-[#f5d26a]/25 text-[#4b2e19] text-[11px] md:text-xs font-semibold px-4 py-1.5">
                      6% GST Cess included in MRP
                    </span>
                  </div>
                </div>

                {/* Tags/Features */}
                <div>
                  {/* <h3 className="text-2xl font-bold text-[#4b2e19] mb-3">Key Features</h3> */}
                  <div className="flex flex-wrap gap-3">
                    {(product.Tags ?? []).map((tag, index) => (
                      <span key={index} className="bg-[#f5f2ea] text-[#4b2e19] px-3 py-1 rounded-full text-xs font-medium">
                        {tag.Value}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Variant Selection */}
                {product.Variants && product.Variants.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-[#4b2e19] mb-3">Select size</p>
                    <div className="flex flex-col gap-3">
                      {product.Variants.map((variant, index) => {
                        const variantPrice = variant.Price - (variant.Discount || 0);
                        const variantSavings = variant.Discount || 0;
                        const isSelected = selectedVariant?.id === variant.id;

                        return (
                          <button
                            key={index}
                            onClick={() => setSelectedVariant(variant)}
                            className={`overflow-hidden rounded-xl border text-left transition-all shadow-[0_2px_12px_rgba(75,46,25,0.06)] ${isSelected
                              ? "border-[#4b2e19]"
                              : "border-[#e8e4dc] hover:border-[#4b2e19]/40"
                              }`}
                          >
                            <div className={`px-4 py-2 text-sm font-semibold ${isSelected ? "bg-[#4b2e19] text-white" : "bg-[#f5f2ea] text-[#4b2e19]"}`}>
                              {formatUnit(variant.Weight, product.Type)}
                            </div>
                            <div className="flex items-center justify-between gap-3 bg-white px-4 py-3">
                              <div>
                                <span className="text-lg font-bold text-[#2D2D2D]">{formatInr(variantPrice)}</span>
                                {variantSavings > 0 && (
                                  <span className="ml-2 text-sm text-[#2D2D2D]/45 line-through">{formatInr(variant.Price)}</span>
                                )}
                              </div>
                              {variant.Price > 0 && variantSavings > 0 && (
                                <span className="text-sm font-semibold text-red-600">{Math.round((variantSavings / variant.Price) * 100)}% off</span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Add to Cart Actions - Desktop Only */}
                <div className="hidden md:block">
                  <div className="flex gap-3">
                    {itemInCart ? (
                      <>
                        <div className="flex-1 bg-green-50 text-green-800 py-3.5 rounded-full font-semibold text-center">
                          In Cart ({cartQuantity})
                        </div>
                        <Link
                          href="/cart"
                          className="flex items-center justify-center px-5 py-3.5 border border-[#e8e4dc] text-[#4b2e19] rounded-full hover:bg-[#f5f2ea] transition-colors"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </Link>
                      </>
                    ) : (
                      <>
                        <button
                          className={`flex-1 bg-[#4b2e19] text-white py-3.5 rounded-full font-semibold hover:bg-[#2f4f2f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${ctaAttentionClass}`}
                          onClick={handleAddToCart}
                          disabled={cartLoading || !selectedVariant}
                        >
                          {cartLoading ? 'Adding...' : 'Add to Cart'}
                        </button>
                        <button
                          className={`flex-1 bg-[#f5d26a] text-[#4b2e19] py-3.5 rounded-full font-semibold hover:bg-[#e6c25a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${ctaAttentionClass}`}
                          onClick={handleBuyNow}
                          disabled={cartLoading || !selectedVariant}
                        >
                          {cartLoading ? 'Processing...' : 'Buy Now'}
                        </button>
                        <button
                          onClick={toggleLike}
                          className={`px-5 py-3.5 border border-[#e8e4dc] rounded-full transition-colors ${isLiked
                            ? 'bg-[#4b2e19] text-white'
                            : 'text-[#4b2e19] hover:bg-[#4b2e19] hover:text-white'
                            }`}
                        >
                          <svg className="w-6 h-6" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Trust Badges / USPs */}
                <div className="grid grid-cols-4 gap-2 md:gap-3 pt-3">
                  <div className="flex flex-col items-center text-center group">
                    <svg className="w-8 h-8 md:w-9 md:h-9 mb-1 text-[#4b2e19] group-hover:text-[#f5d26a] transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l3 3.5v5.5a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2h5z" />
                      <circle cx="6" cy="18" r="2" strokeWidth={1.5} />
                      <circle cx="18" cy="18" r="2" strokeWidth={1.5} />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7v6m4-6v6" />
                    </svg>
                    <span className="text-[9px] md:text-[11px] text-[#2D2D2D]/80 leading-tight font-medium uppercase tracking-wide">Free shipping<br/><span className="lowercase">above</span> {formatInr(1499)}</span>
                  </div>
                  
                  <div className="flex flex-col items-center text-center group">
                    <svg className="w-8 h-8 md:w-9 md:h-9 mb-1 text-[#4b2e19] group-hover:text-[#f5d26a] transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 16.5l1.5 1.5 3-3" />
                    </svg>
                    <span className="text-[9px] md:text-[11px] text-[#2D2D2D]/80 leading-tight font-medium uppercase tracking-wide">Secure<br/>Payments</span>
                  </div>

                  <div className="flex flex-col items-center text-center group">
                    <svg className="w-8 h-8 md:w-9 md:h-9 mb-1 text-[#4b2e19] group-hover:text-[#f5d26a] transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2A10 10 0 002 12a10 10 0 0010 10 10 10 0 0010-10A10 10 0 0012 2zm0 4a2 2 0 110 4 2 2 0 010-4zm0 12c-2.67 0-8-1.34-8-4v-1.55c2.19-2 5.56-2.45 8-2.45s5.81.45 8 2.45V14c0 2.66-5.33 4-8 4z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 16v-6" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13c0-2 3-5 3-5s3 3 3 5" />
                    </svg>
                    <span className="text-[9px] md:text-[11px] text-[#2D2D2D]/80 leading-tight font-medium uppercase tracking-wide">Farmers<br/>Empowerment</span>
                  </div>

                  <div className="flex flex-col items-center text-center group">
                    <svg className="w-8 h-8 md:w-9 md:h-9 mb-1 text-[#4b2e19] group-hover:text-[#f5d26a] transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-[9px] md:text-[11px] text-[#2D2D2D]/80 leading-tight font-medium uppercase tracking-wide">COD<br/>available</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product details — open sections */}
        <section className="py-6 md:py-8 bg-white border-t border-[#f0ebe3]">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-center text-sm font-bold text-[#4b2e19] tracking-[0.2em] uppercase mb-4">
              Product Description
            </h2>
            <p className="text-[#2D2D2D]/75 text-sm md:text-base leading-relaxed text-center whitespace-pre-wrap">
              {product.Description}
            </p>
          </div>
        </section>

        <section className="py-6 md:py-8 bg-[#fdfbf7]">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-center text-xl md:text-2xl font-bold text-[#4b2e19] mb-4">Benefits</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 md:gap-x-8">
              {(product.Type === "Ghee"
                ? [
                    { title: "Gut Health", desc: "Aids digestion and supports a healthy gut with essential fatty acids.", icon: "/images/bilona.png" },
                    { title: "Immunity Boost", desc: "Strengthens natural immunity with fat-soluble vitamins A, D, E & K.", icon: "/images/pure.png" },
                    { title: "Bilona Churned", desc: "Slow-crafted using the traditional bilona method for maximum nutrition.", icon: "/images/traditionalpreparation.png" },
                    { title: "Small Batches", desc: "Made in small batches to preserve purity, aroma, and authentic taste.", icon: "/images/madeinsmallbatches.png" },
                  ]
                : [
                    { title: "Gut Health", desc: "Supports digestive wellness with natural enzymes and prebiotics.", icon: "/images/leaf.png" },
                    { title: "Antioxidant-Rich", desc: "Packed with antioxidants that help fight free radicals naturally.", icon: "/images/pure.png" },
                    { title: "Raw & Unprocessed", desc: "Cold-extracted and never heated — preserving natural goodness.", icon: "/images/traditionalpreparation.png" },
                    { title: "Forest Sourced", desc: "Ethically harvested from pristine forests by local beekeepers.", icon: "/images/farm.png" },
                  ]
              ).map((item, i) => {
                const needsBrownBg =
                  item.icon === "/images/madeinsmallbatches.png" ||
                  item.icon === "/images/pure.png";
                return (
                  <div key={i} className="flex gap-4 items-start">
                    <div className={`w-12 h-12 shrink-0 flex items-center justify-center ${needsBrownBg ? "rounded-full bg-[#4b2e19]" : ""}`}>
                      <Image src={item.icon} alt="" width={40} height={40} className="w-10 h-10 object-contain opacity-90" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#4b2e19] mb-1">{item.title}</h3>
                      <p className="text-sm text-[#2D2D2D]/65 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-5 md:py-7 bg-white">
          <div className="container mx-auto px-4 max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-[#f5f2ea]/60 px-4 py-5">
              <h3 className="text-sm font-bold text-[#4b2e19] tracking-[0.15em] uppercase mb-3">Ingredients</h3>
              <p className="text-sm text-[#2D2D2D]/75 leading-relaxed">
                {product.Type === "Ghee" ? "100% Pure A2 Cow Milk Fat." : "100% Pure Raw Honey."}
              </p>
            </div>
            <div className="rounded-2xl bg-[#f5f2ea]/60 px-4 py-5">
              <h3 className="text-sm font-bold text-[#4b2e19] tracking-[0.15em] uppercase mb-3">Storage</h3>
              <p className="text-sm text-[#2D2D2D]/75 leading-relaxed">
                {product.Type === "Ghee"
                  ? "Store in a cool, dry place away from direct sunlight. Do not refrigerate. Always use a clean and dry spoon."
                  : "Store at room temperature in a dry place. Do not refrigerate. Crystallization is natural; place jar in warm water to reliquefy."}
              </p>
            </div>
          </div>
        </section>

        {/* Infographics Section: Quality Checks & Comparison */}
        {product.Type === 'Ghee' && (
          <section className="py-6 md:py-8 bg-[#fdfbf7] relative z-10">
            <div className="container mx-auto px-4 max-w-6xl">
              <div className="text-center mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-[#4b2e19] mb-3">Why Yuga Farms Ghee?</h2>
                <div className="w-24 h-1 bg-[#f5d26a] mx-auto rounded-full"></div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
                {/* Custom Quality Check Image/Card */}
                <div className="bg-[#4b2e19] rounded-3xl p-5 md:p-7 text-white shadow-[0_8px_32px_rgba(75,46,25,0.12)] relative overflow-hidden flex flex-col justify-center">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none"></div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-1">70+ Quality Checks.</h3>
                  <h3 className="text-2xl md:text-3xl font-bold text-[#f5d26a] mb-4">0% Compromise.</h3>
                  
                  <div className="flex flex-col gap-3 relative z-10">
                    <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6 text-[#f5d26a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg md:text-xl mb-0.5 text-[#fdf7f2]">Heavy Metal Free</h4>
                        <p className="text-white/70 text-sm">Rigorously lab tested for absolute purity.</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6 text-[#f5d26a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg md:text-xl mb-0.5 text-[#fdf7f2]">FDA Compliant Facility</h4>
                        <p className="text-white/70 text-sm">Adhering to the highest global safety standards.</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6 text-[#f5d26a]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg md:text-xl mb-0.5 text-[#fdf7f2]">Hormone & Antibiotic Free</h4>
                        <p className="text-white/70 text-sm">Sourced only from free-grazing healthy cows.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comparison Card */}
                <div className="bg-[#f5f2ea] rounded-3xl p-5 md:p-7 shadow-[0_4px_24px_rgba(75,46,25,0.06)] flex flex-col justify-center">
                  <h3 className="text-lg md:text-xl font-bold text-[#4b2e19] mb-4 text-center">Yuga Farms vs Ordinary Ghee</h3>
                  
                  <div className="space-y-4 md:space-y-5">
                    <div className="flex justify-between items-center pb-4 border-b border-[#4b2e19]/10">
                      <div className="w-[45%] text-right font-bold text-[#2f4f2f] text-sm md:text-base">Single-origin A2 milk</div>
                      <div className="w-[10%] flex justify-center"><div className="w-2 h-2 rounded-full bg-[#f5d26a] shadow-[0_0_10px_rgba(245,210,106,0.8)]"></div></div>
                      <div className="w-[45%] text-left text-[#2D2D2D]/50 line-through decoration-red-400 text-sm md:text-base">Mixed-breed milk</div>
                    </div>

                    <div className="flex justify-between items-center pb-4 border-b border-[#4b2e19]/10">
                      <div className="w-[45%] text-right font-bold text-[#2f4f2f] text-sm md:text-base">Free-grazing cows</div>
                      <div className="w-[10%] flex justify-center"><div className="w-2 h-2 rounded-full bg-[#f5d26a] shadow-[0_0_10px_rgba(245,210,106,0.8)]"></div></div>
                      <div className="w-[45%] text-left text-[#2D2D2D]/50 line-through decoration-red-400 text-sm md:text-base">Grain-fed cows</div>
                    </div>

                    <div className="flex justify-between items-center pb-4 border-b border-[#4b2e19]/10">
                      <div className="w-[45%] text-right font-bold text-[#2f4f2f] text-sm md:text-base">Traditional Bilona process</div>
                      <div className="w-[10%] flex justify-center"><div className="w-2 h-2 rounded-full bg-[#f5d26a] shadow-[0_0_10px_rgba(245,210,106,0.8)]"></div></div>
                      <div className="w-[45%] text-left text-[#2D2D2D]/50 line-through decoration-red-400 text-sm md:text-base">Factory mass-produced</div>
                    </div>

                    <div className="flex justify-between items-center pb-4 border-b border-[#4b2e19]/10">
                      <div className="w-[45%] text-right font-bold text-[#2f4f2f] text-sm md:text-base">Made from Curd (Makhan)</div>
                      <div className="w-[10%] flex justify-center"><div className="w-2 h-2 rounded-full bg-[#f5d26a] shadow-[0_0_10px_rgba(245,210,106,0.8)]"></div></div>
                      <div className="w-[45%] text-left text-[#2D2D2D]/50 line-through decoration-red-400 text-sm md:text-base">Made directly from cream</div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="w-[45%] text-right font-bold text-[#2f4f2f] text-sm md:text-base">Rich, sweet-caramel aroma</div>
                      <div className="w-[10%] flex justify-center"><div className="w-2 h-2 rounded-full bg-[#f5d26a] shadow-[0_0_10px_rgba(245,210,106,0.8)]"></div></div>
                      <div className="w-[45%] text-left text-[#2D2D2D]/50 line-through decoration-red-400 text-sm md:text-base">Pale, bland taste</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        {product && (
          <section className="py-6 md:py-8 bg-white relative z-10">
            <div className="container mx-auto px-4 max-w-6xl">
              <div className="mb-8 rounded-2xl border border-[#e8e4dc] bg-[#fdfbf7] p-4 md:p-6">
                <h2 className="text-xl md:text-2xl font-bold text-[#4b2e19] mb-4">Ratings & Reviews</h2>

                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5">
                  <div className="rounded-xl border border-[#e8e4dc] bg-white p-4">
                    <div className="flex items-end gap-2">
                      <span className="text-4xl font-bold text-[#2D2D2D]">{averageRating.toFixed(1)}</span>
                      <span className="text-[#f5d26a] text-lg">★</span>
                    </div>
                    <p className="text-sm text-[#2D2D2D]/60 mt-1">
                      {ratingCount} ratings • {comments.length} reviews
                    </p>
                    <div className="mt-4 space-y-2">
                      {ratingBreakdown.map((row) => (
                        <div key={row.star} className="grid grid-cols-[20px_1fr_32px] items-center gap-2 text-xs">
                          <span className="text-[#4b2e19]">{row.star}★</span>
                          <div className="h-2 rounded bg-[#f1ede6] overflow-hidden">
                            <div
                              className="h-2 rounded bg-[#4b2e19]"
                              style={{ width: `${row.percent}%` }}
                            />
                          </div>
                          <span className="text-[#2D2D2D]/60 text-right">{row.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#e8e4dc] bg-white p-4">
                    <p className="text-sm text-[#2D2D2D]/75 mb-3">
                      Share your review. It will show on all <strong>{product.Type}</strong> products.
                    </p>
                    <div className="flex flex-col gap-3">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={`Write your ${product.Type} review...`}
                        rows={3}
                        className="w-full rounded-lg border border-[#e8e4dc] bg-[#fdfbf7] px-3 py-2 text-sm text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#4b2e19]/20"
                      />
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <label className="text-sm text-[#2D2D2D]/70">Your Rating</label>
                          <select
                            value={newRating}
                            onChange={(e) => setNewRating(Number(e.target.value))}
                            className="rounded-md border border-[#e8e4dc] bg-[#fdfbf7] px-2 py-1 text-sm text-[#2D2D2D]"
                          >
                            {[5, 4, 3, 2, 1].map((r) => (
                              <option key={r} value={r}>
                                {r} Star{r > 1 ? "s" : ""}
                              </option>
                            ))}
                          </select>
                        </div>
                        <button
                          onClick={submitComment}
                          disabled={isSubmittingComment}
                          className="bg-[#4b2e19] text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-[#2f4f2f] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {isSubmittingComment ? "Posting..." : user ? "Rate Product" : "Login to Rate"}
                        </button>
                      </div>
                      {commentStatus && (
                        <p className="text-xs text-[#4b2e19]">{commentStatus}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-5 divide-y divide-[#f0f0f0]">
                  {comments.length > 0 ? (
                    comments.slice(0, 8).map((row) => (
                      <article key={row.id} className="py-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-flex items-center rounded bg-[#4b2e19] text-white text-xs font-semibold px-2 py-0.5">
                            {typeof row.Rating === "number" ? Math.max(0, Math.min(5, Math.round(row.Rating))) : 5} ★
                          </span>
                          <span className="text-xs text-[#2D2D2D]/60">
                            Verified {product.Type} buyer
                          </span>
                          <span className="text-xs text-[#4b2e19] font-medium">
                            • {row.user?.username?.trim() || "Yuga Farms Customer"}
                          </span>
                          {isCommentOwner(row) && editingCommentId !== row.id && (
                            <div className="ml-auto flex items-center gap-3">
                              <button
                                onClick={() => startEditComment(row)}
                                className="text-xs font-semibold text-[#4b2e19] hover:underline"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteComment(row)}
                                disabled={isDeletingCommentId === row.id}
                                className="text-xs font-semibold text-red-700 hover:underline disabled:opacity-60"
                              >
                                {isDeletingCommentId === row.id ? "Deleting..." : "Delete"}
                              </button>
                            </div>
                          )}
                        </div>
                        {editingCommentId === row.id ? (
                          <div className="space-y-2">
                            <textarea
                              value={editCommentText}
                              onChange={(e) => setEditCommentText(e.target.value)}
                              rows={3}
                              className="w-full rounded-lg border border-[#e8e4dc] bg-white px-3 py-2 text-sm text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#4b2e19]/20"
                            />
                            <div className="flex items-center gap-2">
                              <label className="text-xs text-[#2D2D2D]/70">Rating</label>
                              <select
                                value={editRating}
                                onChange={(e) => setEditRating(Number(e.target.value))}
                                className="rounded-md border border-[#e8e4dc] bg-[#fdfbf7] px-2 py-1 text-xs text-[#2D2D2D]"
                              >
                                {[5, 4, 3, 2, 1].map((r) => (
                                  <option key={r} value={r}>
                                    {r} Star{r > 1 ? "s" : ""}
                                  </option>
                                ))}
                              </select>
                              <div className="ml-auto flex gap-2">
                                <button
                                  onClick={cancelEditComment}
                                  className="text-xs px-3 py-1 rounded border border-[#e8e4dc] text-[#2D2D2D]"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={updateComment}
                                  disabled={isUpdatingComment}
                                  className="text-xs px-3 py-1 rounded bg-[#4b2e19] text-white disabled:opacity-60"
                                >
                                  {isUpdatingComment ? "Saving..." : "Save"}
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-[#2D2D2D] leading-relaxed">{row.Comment}</p>
                        )}
                      </article>
                    ))
                  ) : (
                    <p className="text-center text-sm text-[#2D2D2D]/60 py-6">
                      No reviews yet for {product.Type}. Be the first to rate this product.
                    </p>
                  )}
                </div>
              </div>

              <h2 className="text-center text-xl md:text-2xl font-bold text-[#4b2e19] mb-4">Faqs</h2>

              <div className="space-y-3">
                {(product.Type === "Ghee" ? [
                  { question: "What is the Bilona method?", answer: "The Bilona method is a traditional, slow-churning process where milk is first curdled in clay pots, then the curd is hand-churned using a wooden blender (bilona) to extract makkhan (butter). This butter is then slowly heated on a wood-fire to produce pure, nutrient-rich ghee." },
                  { question: "Why is your ghee slightly yellow?", answer: "Our ghee is primarily made from A2 cow milk, which naturally contains beta-carotene from the cows' natural grazing diet. This gives it a beautiful, rich golden-yellow hue without any artificial coloring." },
                  { question: "Does this ghee contain lactose?", answer: "Because of our traditional culturing and churning process, the milk solids (lactose and casein) are separated and removed. Our ghee is mostly free of lactose, making it highly suitable for individuals with mild lactose sensitivities." },
                  { question: "What is the shelf life of Yuga Farms Ghee?", answer: "Pure unadulterated ghee has a naturally long shelf life. Ours can be stored at room temperature for up to 12 months. Ensure you use a dry spoon and keep the jar tightly closed away from direct moisture." }
                ] : [
                  { question: "Is your honey raw and unprocessed?", answer: "Yes! Our honey is 100% raw, cold-extracted, and unfiltered. It is never heated or pasteurized, ensuring that all the natural enzymes, pollen, and antioxidants are perfectly preserved." },
                  { question: "Why did my honey crystallize?", answer: "Crystallization is an entirely natural process and a sign of pure, unheated honey. To bring it back to a liquid state, simply place the glass jar in a warm (not boiling) water bath and stir gently." },
                  { question: "How is your honey sourced?", answer: "Our honey is sustainably sourced directly from local bee farmers and deep forests. We ensure ethical practices that support bee populations and pristine natural environments without using sugar-feeding." },
                  { question: "Does honey expire?", answer: "Pure honey never truly expires. It is naturally antibacterial and can last indefinitely if stored properly in a tightly sealed glass container at room temperature away from direct sunlight." }
                ]).map((faq, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-[#e8e4dc] bg-white shadow-[0_2px_12px_rgba(75,46,25,0.04)] overflow-hidden"
                  >
                    <button
                      className="w-full px-4 py-3 text-left flex justify-between items-start gap-3 focus:outline-none"
                      onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                    >
                      <span className="text-sm md:text-base text-[#4b2e19] leading-snug">
                        <span className="font-bold">Q.</span> {faq.question}
                      </span>
                      <span className="shrink-0 text-xl font-light text-[#4b2e19]/60 leading-none pt-0.5">
                        {openFaqIndex === index ? "\u2212" : "+"}
                      </span>
                    </button>
                    <div
                      className={`px-5 transition-all duration-300 ease-in-out overflow-hidden ${openFaqIndex === index ? "max-h-96 pb-4 opacity-100" : "max-h-0 opacity-0"}`}
                    >
                      <p className="text-sm text-[#2D2D2D]/70 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <SimilarProducts products={similarProducts} currentType={product.Type} />

        {/* Back to Products */}
        <section className="py-5 md:py-6 bg-white">
          <div className="container mx-auto px-4 text-center">
            <Link
              href={`/${product.Type.toLowerCase()}`}
              className="inline-flex items-center gap-2 bg-[#4b2e19] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#2f4f2f] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to {product.Type} Collection
            </Link>
          </div>
        </section>

        {/* Fixed Bottom Bar - Mobile Only */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-[#e8e4dc] shadow-[0_-4px_24px_rgba(0,0,0,0.06)] z-50">
          <div className="container mx-auto px-4 py-3">
            {/* Price Info */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-[#4b2e19]">{formatInr(currentPrice)}</span>
                  {originalPrice > currentPrice && (
                    <span className="text-lg text-[#2D2D2D]/60 line-through">{formatInr(originalPrice)}</span>
                  )}
                </div>
                {selectedVariant && (
                  <div className="text-xs text-[#2D2D2D]/70">
                    {formatUnit(selectedVariant.Weight, product.Type)}
                  </div>
                )}
              </div>
              {savings > 0 && (
                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-semibold">
                  Save {formatInr(savings)}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {itemInCart ? (
                <>
                  <div className="flex-1 bg-green-100 text-green-800 py-3 rounded-lg font-semibold text-center border-2 border-green-300 text-sm">
                    In Cart ({cartQuantity})
                  </div>
                  <Link
                    href="/cart"
                    className="flex items-center justify-center px-4 py-3 border-2 border-[#4b2e19] text-[#4b2e19] rounded-lg font-semibold hover:bg-[#4b2e19] hover:text-white transition-colors duration-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </Link>
                </>
              ) : (
                <>
                  <button
                    className={`flex-1 bg-[#4b2e19] text-white py-3 rounded-full font-semibold hover:bg-[#2f4f2f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm ${ctaAttentionClass}`}
                    onClick={handleAddToCart}
                    disabled={cartLoading || !selectedVariant}
                  >
                    {cartLoading ? 'Adding...' : 'Add to Cart'}
                  </button>
                  <button
                    className={`flex-1 bg-[#f5d26a] text-[#4b2e19] py-3 rounded-full font-semibold hover:bg-[#e6c25a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm ${ctaAttentionClass}`}
                    onClick={handleBuyNow}
                    disabled={cartLoading || !selectedVariant}
                  >
                    {cartLoading ? 'Processing...' : 'Buy Now'}
                  </button>
                  <button
                    onClick={toggleLike}
                    className={`flex items-center justify-center px-4 py-3 border-2 border-[#4b2e19] rounded-lg font-semibold transition-colors duration-300 ${isLiked
                        ? 'bg-[#4b2e19] text-white'
                        : 'text-[#4b2e19] hover:bg-[#4b2e19] hover:text-white'
                      }`}
                  >
                    <svg className="w-5 h-5" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Spacer for fixed bottom bar on mobile */}
        <div className="md:hidden h-32"></div>
      </main>
      <style jsx>{`
        .cta-wiggle {
          animation: ctaWiggle 3.2s ease-in-out infinite;
          transform-origin: center;
        }
        .cta-wiggle:hover,
        .cta-wiggle:focus-visible,
        .cta-wiggle:disabled {
          animation-play-state: paused;
        }
        @keyframes ctaWiggle {
          0%, 88%, 100% { transform: rotate(0deg); }
          90% { transform: rotate(-1.2deg); }
          94% { transform: rotate(1.2deg); }
          97% { transform: rotate(-0.8deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .cta-wiggle { animation: none; }
        }
      `}</style>
      <Footer />
    </>
  );
}

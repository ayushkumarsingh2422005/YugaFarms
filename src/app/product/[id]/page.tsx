'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { addToCart, isLoading: cartLoading, items: cartItems } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        
        // First try to get the product with publication state
        let response = await fetch(`${BACKEND}/api/products/${params.id}?publicationState=live&populate=*`);
        
        if (!response.ok) {
          // If that fails, try without publication state
          response = await fetch(`${BACKEND}/api/products/${params.id}?populate=*`);
        }
        
        if (!response.ok) {
          // If individual fetch fails, try to find the product in the list
          const listResponse = await fetch(`${BACKEND}/api/products?populate=*`);
          if (listResponse.ok) {
            const listData = await listResponse.json();
            const foundProduct = listData.data?.find((p: Product) => p.id.toString() === params.id);
            if (foundProduct) {
              setProduct(foundProduct);
              if (foundProduct.Variants?.length > 0) {
                setSelectedVariant(foundProduct.Variants[0]);
              }
              setLoading(false);
              return;
            }
          }
          throw new Error('Product not found');
        }
        
        const data = await response.json();
        setProduct(data.data);
        
        // Set the first variant as selected by default
        if (data.data?.Variants?.length > 0) {
          setSelectedVariant(data.data.Variants[0]);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

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
      if (titleLower.includes('a2') || titleLower.includes('desi')) return '🧈';
      if (titleLower.includes('classic') || titleLower.includes('cow')) return '🐄';
      if (titleLower.includes('buffalo')) return '🥛';
      if (titleLower.includes('organic')) return '🌿';
      if (titleLower.includes('spiced') || titleLower.includes('spice')) return '🌶️';
      if (titleLower.includes('family') || titleLower.includes('pack')) return '👨‍👩‍👧‍👦';
      return '🧈';
    } else {
      if (titleLower.includes('wild') || titleLower.includes('forest')) return '🍯';
      if (titleLower.includes('acacia')) return '🌼';
      if (titleLower.includes('eucalyptus')) return '🌿';
      if (titleLower.includes('multi') || titleLower.includes('flower')) return '🌸';
      if (titleLower.includes('manuka')) return '👑';
      if (titleLower.includes('family') || titleLower.includes('pack')) return '👨‍👩‍👧‍👦';
      return '🍯';
    }
  };

  const getProductGradient = (type: string) => {
    if (type === "Ghee") {
      return "from-[#f5d26a] to-[#e6b800]";
    } else {
      return "from-[#f5d26a] to-[#e6b800]";
    }
  };

  if (loading) {
    return (
      <>
        <TopBar />
        <main className="min-h-screen bg-gradient-to-br from-[#fdf7f2] via-[#f8f4e6] to-[#f0e6d2] relative overflow-hidden pt-20">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4b2e19] mx-auto mb-4"></div>
              <p className="text-[#4b2e19] text-lg">Loading product details...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <TopBar />
        <main className="min-h-screen bg-gradient-to-br from-[#fdf7f2] via-[#f8f4e6] to-[#f0e6d2] relative overflow-hidden pt-20">
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
  const gradient = getProductGradient(product.Type);
  const itemInCart = isItemInCart();
  const cartQuantity = getCartItemQuantity();

  return (
    <>
      <TopBar />
      <main className="min-h-screen bg-gradient-to-br from-[#fdf7f2] via-[#f8f4e6] to-[#f0e6d2] relative overflow-hidden pt-20">
        {/* Breadcrumb */}
        <div className="container mx-auto px-4 pt-8">
          <nav className="flex items-center space-x-2 text-sm text-[#2D2D2D]/70 mb-8">
            <Link href="/" className="hover:text-[#4b2e19] transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/${product.Type.toLowerCase()}`} className="hover:text-[#4b2e19] transition-colors capitalize">
              {product.Type}
            </Link>
            <span>/</span>
            <span className="text-[#4b2e19] font-medium">{product.Title}</span>
          </nav>
        </div>

        {/* Product Detail Section */}
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Product Images */}
              <div className="space-y-4">
                {/* Main Image */}
                <div className={`relative h-96 lg:h-[500px] bg-gradient-to-br ${gradient} rounded-3xl flex items-center justify-center overflow-hidden`}>
                  {product.Image && product.Image.length > 0 ? (
                    <img 
                      src={`${BACKEND}${product.Image[selectedImageIndex].url}`} 
                      alt={product.Image[selectedImageIndex].alternativeText || product.Title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                      <span className="text-9xl relative z-10 drop-shadow-lg">{emoji}</span>
                    </>
                  )}
                  
                  {/* Rating Badge */}
                  <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#f5d26a]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.176 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81H6.93a1 1 0 00.95-.69l1.07-3.292z"/>
                      </svg>
                      <span className="text-lg font-bold text-[#2D2D2D]">{product.Rating}</span>
                    </div>
                  </div>
                </div>

                {/* Thumbnail Images */}
                {product.Image && product.Image.length > 1 && (
                  <div className="grid grid-cols-4 gap-3">
                    {product.Image.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative h-20 rounded-xl overflow-hidden border-2 transition-all ${
                          selectedImageIndex === index 
                            ? 'border-[#4b2e19] shadow-lg' 
                            : 'border-transparent hover:border-[#4b2e19]/50'
                        }`}
                      >
                        <img 
                          src={`${BACKEND}${image.url}`} 
                          alt={image.alternativeText || `${product.Title} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Information */}
              <div className="space-y-6">
                {/* Title and Punch Line */}
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-[#4b2e19] mb-3">{product.Title}</h1>
                  <p className="text-xl text-[#2D2D2D]/80 font-medium mb-4">{product.PunchLine}</p>
                  
                  {/* Rating and Sales */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg key={i} className="w-5 h-5 text-[#f5d26a]" fill={i < Math.floor(product.Rating) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.176 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81H6.93a1 1 0 00.95-.69l1.07-3.292z"/>
                          </svg>
                        ))}
                      </div>
                      <span className="text-[#2D2D2D]/70 font-medium">({product.NumberOfPurchase} customers)</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="prose prose-lg max-w-none">
                  <h3 className="text-2xl font-bold text-[#4b2e19] mb-3">About This Product</h3>
                  <p className="text-[#2D2D2D]/80 leading-relaxed text-lg">{product.Description}</p>
                </div>

                {/* Tags/Features */}
                <div>
                  <h3 className="text-2xl font-bold text-[#4b2e19] mb-3">Key Features</h3>
                  <div className="flex flex-wrap gap-3">
                    {product.Tags.map((tag, index) => (
                      <span key={index} className="bg-[#eef2e9] text-[#4b2e19] px-4 py-2 rounded-full font-medium text-sm">
                        {tag.Value}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Variant Selection */}
                {product.Variants && product.Variants.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-bold text-[#4b2e19] mb-3">Available Sizes</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {product.Variants.map((variant, index) => {
                        const variantPrice = variant.Price - (variant.Discount || 0);
                        const variantSavings = variant.Discount || 0;
                        const isSelected = selectedVariant?.id === variant.id;
                        
                        return (
                          <button
                            key={index}
                            onClick={() => setSelectedVariant(variant)}
                            className={`p-4 rounded-xl border-2 transition-all text-left ${
                              isSelected 
                                ? 'border-[#4b2e19] bg-[#4b2e19]/5 shadow-lg' 
                                : 'border-[#4b2e19]/20 hover:border-[#4b2e19]/50 bg-white'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-semibold text-[#4b2e19]">{variant.Weight}g</div>
                                <div className="text-sm text-[#2D2D2D]/70">Stock: {variant.Stock}</div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-[#4b2e19]">₹{variantPrice}</div>
                                {variantSavings > 0 && (
                                  <div className="text-sm text-red-600">Save ₹{variantSavings}</div>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Price and Add to Cart */}
                <div className="bg-white/50 rounded-2xl p-6 border border-[#4b2e19]/10">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-4">
                        <span className="text-4xl font-bold text-[#4b2e19]">₹{currentPrice}</span>
                        {originalPrice > currentPrice && (
                          <>
                            <span className="text-2xl text-[#2D2D2D]/60 line-through">₹{originalPrice}</span>
                            {savings > 0 && (
                              <span className="bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-semibold">
                                Save ₹{savings}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                      {selectedVariant && (
                        <div className="text-[#2D2D2D]/70 mt-2">
                          {selectedVariant.Weight}g • {product.NumberOfPurchase}+ happy customers
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    {itemInCart ? (
                      <>
                        <div className="flex-1 bg-green-100 text-green-800 py-4 rounded-xl font-semibold text-center border-2 border-green-300 text-lg">
                          ✓ In Cart ({cartQuantity})
                        </div>
                        <Link 
                          href="/cart"
                          className="px-6 py-4 border-2 border-[#4b2e19] text-[#4b2e19] rounded-xl font-semibold hover:bg-[#4b2e19] hover:text-white transition-colors duration-300"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </Link>
                      </>
                    ) : (
                      <>
                        <button 
                          className="flex-1 bg-[#4b2e19] text-white py-4 rounded-xl font-semibold hover:bg-[#2f4f2f] transition-colors duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                          onClick={handleAddToCart}
                          disabled={cartLoading || !selectedVariant}
                        >
                          {cartLoading ? 'Adding...' : 'Add to Cart'}
                        </button>
                        <button className="px-6 py-4 border-2 border-[#4b2e19] text-[#4b2e19] rounded-xl font-semibold hover:bg-[#4b2e19] hover:text-white transition-colors duration-300">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Back to Products */}
        <section className="py-8 bg-[#eef2e9]">
          <div className="container mx-auto px-4 text-center">
            <Link 
              href={`/${product.Type.toLowerCase()}`}
              className="inline-flex items-center gap-2 bg-[#4b2e19] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#2f4f2f] transition-colors duration-300 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to {product.Type} Collection
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

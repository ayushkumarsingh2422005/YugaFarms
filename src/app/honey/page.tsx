'use client'
import React from "react";
import Image from "next/image";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";

export default function HoneyPage() {
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
                 Raw, unfiltered honey straight from nature's bounty. Experience the pure sweetness and health benefits of authentic honey.
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
              {[
                {
                  title: "Wild Forest Honey",
                  subtitle: "Premium Raw",
                  description: "Collected from wild forest areas, this honey offers unique flavors and maximum health benefits.",
                  rating: 4.9,
                  totalBuys: 1850,
                  originalPrice: 899,
                  currentPrice: 699,
                  savings: 200,
                  weights: [
                    { value: "500g", price: 699, originalPrice: 899 },
                    { value: "1kg", price: 1299, originalPrice: 1699 },
                    { value: "2kg", price: 2399, originalPrice: 3199 }
                  ],
                  features: ["Wild Forest", "Raw & Unfiltered", "Lab Tested", "No Preservatives"],
                  emoji: "🍯",
                  gradient: "from-[#f5d26a] to-[#e6b800]",
                  badge: "Best Seller"
                },
                {
                  title: "Acacia Honey",
                  subtitle: "Light & Delicate",
                  description: "Pure acacia honey with a light, floral taste and crystal-clear appearance. Perfect for daily use.",
                  rating: 4.8,
                  totalBuys: 1650,
                  originalPrice: 799,
                  currentPrice: 599,
                  savings: 200,
                  weights: [
                    { value: "500g", price: 599, originalPrice: 799 },
                    { value: "1kg", price: 1099, originalPrice: 1499 },
                    { value: "2kg", price: 1999, originalPrice: 2799 }
                  ],
                  features: ["Acacia Source", "Light Flavor", "Crystal Clear", "Daily Use"],
                  emoji: "🌼",
                  gradient: "from-[#2f4f2f] to-[#4b2e19]",
                  badge: "Popular"
                },
                {
                  title: "Eucalyptus Honey",
                  subtitle: "Medicinal Properties",
                  description: "Rich in antioxidants and known for its medicinal properties. Great for respiratory health.",
                  rating: 4.7,
                  totalBuys: 1200,
                  originalPrice: 999,
                  currentPrice: 799,
                  savings: 200,
                  weights: [
                    { value: "500g", price: 799, originalPrice: 999 },
                    { value: "1kg", price: 1499, originalPrice: 1899 },
                    { value: "2kg", price: 2799, originalPrice: 3599 }
                  ],
                  features: ["Eucalyptus Source", "Medicinal", "Antioxidants", "Respiratory Health"],
                  emoji: "🌿",
                  gradient: "from-[#8B4513] to-[#D2691E]",
                  badge: "Health"
                },
                {
                  title: "Multi-Flower Honey",
                  subtitle: "Rich & Complex",
                  description: "A blend of various flower nectars creating a rich, complex flavor profile with multiple health benefits.",
                  rating: 4.6,
                  totalBuys: 1400,
                  originalPrice: 699,
                  currentPrice: 549,
                  savings: 150,
                  weights: [
                    { value: "500g", price: 549, originalPrice: 699 },
                    { value: "1kg", price: 999, originalPrice: 1299 },
                    { value: "2kg", price: 1899, originalPrice: 2499 }
                  ],
                  features: ["Multi-Flower", "Rich Flavor", "Complex Taste", "Versatile"],
                  emoji: "🌸",
                  gradient: "from-[#2f4f2f] to-[#4b2e19]",
                  badge: "Classic"
                },
                {
                  title: "Manuka Honey",
                  subtitle: "Superfood Grade",
                  description: "Premium Manuka honey with high MGO levels, known for its exceptional antibacterial properties.",
                  rating: 4.9,
                  totalBuys: 950,
                  originalPrice: 1499,
                  currentPrice: 1199,
                  savings: 300,
                  weights: [
                    { value: "250g", price: 1199, originalPrice: 1499 },
                    { value: "500g", price: 2199, originalPrice: 2799 },
                    { value: "1kg", price: 3999, originalPrice: 5199 }
                  ],
                  features: ["High MGO", "Antibacterial", "Superfood", "Premium Grade"],
                  emoji: "👑",
                  gradient: "from-[#8B4513] to-[#D2691E]",
                  badge: "Premium"
                },
                {
                  title: "Family Pack Honey",
                  subtitle: "Value Pack",
                  description: "Large family pack perfect for households, offering the best value for money with premium quality.",
                  rating: 4.7,
                  totalBuys: 2100,
                  originalPrice: 1299,
                  currentPrice: 999,
                  savings: 300,
                  weights: [
                    { value: "1kg", price: 999, originalPrice: 1299 },
                    { value: "2kg", price: 1899, originalPrice: 2499 },
                    { value: "5kg", price: 4499, originalPrice: 5999 }
                  ],
                  features: ["Value Pack", "Family Size", "Cost Effective", "Premium Quality"],
                  emoji: "👨‍👩‍👧‍👦",
                  gradient: "from-[#f5d26a] to-[#e6b800]",
                  badge: "Value"
                }
              ].map((item, idx) => (
                <div key={idx} className="rounded-3xl border border-[#4b2e19]/15 bg-white shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden">
                  {/* Product Image */}
                  <div className={`relative h-64 bg-gradient-to-br ${item.gradient} rounded-t-3xl flex items-center justify-center overflow-hidden`}>
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                    <span className="text-8xl relative z-10 drop-shadow-lg">{item.emoji}</span>
                    
                    {/* Badge */}
                    <div className="absolute top-4 left-4">
                      <div className="bg-white/90 backdrop-blur-sm text-[#4b2e19] px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                        {item.badge}
                      </div>
                    </div>
                    
                    {/* Rating Badge */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-[#f5d26a]" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.176 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81H6.93a1 1 0 00.95-.69l1.07-3.292z"/>
                        </svg>
                        <span className="text-sm font-bold text-[#2D2D2D]">{item.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-6 space-y-4">
                    {/* Title and Subtitle */}
                    <div>
                      <h3 className="text-2xl font-bold text-[#4b2e19] mb-1">{item.title}</h3>
                      <p className="text-[#2D2D2D]/60 text-sm font-medium">{item.subtitle}</p>
                      <p className="text-[#2D2D2D]/70 text-sm mt-2 leading-relaxed">{item.description}</p>
                    </div>

                    {/* Rating and Sales */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <svg key={i} className="w-4 h-4 text-[#f5d26a]" fill={i < Math.floor(item.rating) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.176 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81H6.93a1 1 0 00.95-.69l1.07-3.292z"/>
                            </svg>
                          ))}
                        </div>
                        <span className="text-[#2D2D2D]/70">({item.totalBuys} bought)</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2">
                      {item.features.map((feature, featureIdx) => (
                        <span key={featureIdx} className="text-xs bg-[#eef2e9] text-[#4b2e19] px-3 py-1 rounded-full font-medium">
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* Weight Selection */}
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-[#2D2D2D]">Select Size:</label>
                      <select className="w-full border border-[#4b2e19]/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#f5d26a]/50 focus:border-[#f5d26a] bg-white shadow-sm">
                        {item.weights.map((weight, weightIdx) => (
                          <option key={weightIdx} value={weight.value}>
                            {weight.value} - ₹{weight.price} (Save ₹{weight.originalPrice - weight.price})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Price and Add to Cart */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl font-bold text-[#4b2e19]">₹{item.currentPrice}</span>
                            <span className="text-lg text-[#2D2D2D]/60 line-through">₹{item.originalPrice}</span>
                            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                              Save ₹{item.savings}
                            </span>
                          </div>
                          <div className="text-sm text-[#2D2D2D]/70">
                            {item.totalBuys}+ happy customers
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <button className="flex-1 bg-[#4b2e19] text-white py-3 rounded-xl font-semibold hover:bg-[#2f4f2f] transition-colors duration-300 shadow-lg hover:shadow-xl">
                          Add to Cart
                        </button>
                        <button className="px-4 py-3 border-2 border-[#4b2e19] text-[#4b2e19] rounded-xl font-semibold hover:bg-[#4b2e19] hover:text-white transition-colors duration-300">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Our Honey Section */}
        <section className="py-16 md:py-20 bg-gradient-to-br bg-[#eef2e9]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-[Pacifico] text-[#4b2e19] mb-4">Why Choose Our Honey?</h2>
              <p className="text-lg text-[#2D2D2D]/70 max-w-2xl mx-auto">
                Every jar of our honey is a testament to nature's perfection and our commitment to purity.
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
        </section>

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

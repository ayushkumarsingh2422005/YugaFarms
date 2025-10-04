
import React from "react";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <TopBar />
      <main
        className="min-h-[90vh] max-h-screen relative overflow-hidden pt-20"
      >
        {/* Background Video */}
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          src="/bg.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        {/* Overlay for slight dimming if needed */}
        <div className="absolute inset-0 bg-[#fdf7f2]/20 z-10 -mt-20"></div>

        {/* Brand Name on top left */}
        <div className="space-x-2 z-40 w-1/3 mt-[7%] ml-[12%] relative">
          <div className="text-[#2D2D2D] tracking-wide text-[80px] font-[Pacifico]">YugaFarms</div>
          <div className="text-[#2D2D2D] text-xl font-semibold mt-2 pl-2">Pure Goodness, Straight from <br /> Our Farm to Your Table</div>
        </div>

        <div className="absolute bottom-10 bg-black text-white px-4 py-2 rounded-full left-[50%] transform translate-x-[-50%] z-40">
          SHOP NOW
        </div>
      </main>

      {/* Wave into Our Top Picks */}
      <div aria-hidden className="relative z-20 -mt-2">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block w-full h-[70px] md:h-[90px] text-[#eef2e9] fill-current">
          <path d="M0,80 C120,40 240,120 360,80 S600,40 720,80 960,120 1080,80 1320,40 1440,80 L1440,120 L0,120 Z"></path>
        </svg>
      </div>

      {/* Our Top Picks (soft sage background) */}
      <div className="bg-[#eef2e9] py-12 md:py-16">
        <section className="relative z-30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-[#4b2e19]">Our Top Picks</h2>
              <Link href="/shop" className="text-[#2f4f2f] hover:underline">View all</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "A2 Desi Ghee",
                  badge: "Best Seller",
                  rating: 4.8,
                  totalBuys: 1250,
                  originalPrice: 899,
                  currentPrice: 699,
                  savings: 200,
                  weights: [
                    { value: "500g", price: 699, originalPrice: 899 },
                    { value: "1kg", price: 1299, originalPrice: 1699 },
                    { value: "2kg", price: 2399, originalPrice: 3199 }
                  ],
                  features: ["Bilona Churned", "Lab Tested", "Pure A2 Milk"],
                  emoji: "🧈"
                },
                {
                  title: "Cold-Pressed Groundnut Oil",
                  badge: "New",
                  rating: 4.6,
                  totalBuys: 890,
                  originalPrice: 599,
                  currentPrice: 499,
                  savings: 100,
                  weights: [
                    { value: "500ml", price: 499, originalPrice: 599 },
                    { value: "1L", price: 899, originalPrice: 1099 },
                    { value: "2L", price: 1699, originalPrice: 2099 }
                  ],
                  features: ["Cold Pressed", "No Chemicals", "Rich in Vitamin E"],
                  emoji: "🥜"
                },
                {
                  title: "Classic Cow Ghee",
                  badge: "Family Pack",
                  rating: 4.7,
                  totalBuys: 2100,
                  originalPrice: 799,
                  currentPrice: 599,
                  savings: 200,
                  weights: [
                    { value: "500g", price: 599, originalPrice: 799 },
                    { value: "1kg", price: 1099, originalPrice: 1499 },
                    { value: "5kg", price: 4999, originalPrice: 6999 }
                  ],
                  features: ["Traditional Method", "Pure Desi Cow", "Family Pack"],
                  emoji: "🐄"
                },
              ].map((item, idx) => (
                <div key={idx} className="rounded-2xl border border-[#4b2e19]/15 bg-white shadow-sm hover:shadow-md transition-shadow group">
                  {/* Product Image */}
                  <div className="relative h-48 bg-gradient-to-br from-[#f5d26a]/20 to-[#f5d26a]/10 rounded-t-2xl border-b border-[#4b2e19]/10 flex items-center justify-center">
                    <span className="text-6xl">{item.emoji}</span>
                    <div className="absolute top-3 left-3">
                      <div className="text-xs bg-[#f5d26a] text-[#4b2e19] px-2 py-1 rounded-full font-semibold">{item.badge}</div>
                    </div>
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3 text-[#f5d26a]" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.176 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81H6.93a1 1 0 00.95-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-xs font-semibold text-[#2D2D2D]">{item.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-5 space-y-4">
                    {/* Title and Rating */}
                    <div>
                      <h3 className="text-lg font-semibold text-[#2D2D2D] mb-2">{item.title}</h3>
                      <div className="flex items-center justify-between text-sm text-[#2D2D2D]/70">
                        <div className="flex items-center gap-1">
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg key={i} className="w-3 h-3 text-[#f5d26a]" fill={i < Math.floor(item.rating) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.176 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81H6.93a1 1 0 00.95-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-xs">({item.totalBuys} bought)</span>
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-1">
                      {item.features.map((feature, featureIdx) => (
                        <span key={featureIdx} className="text-xs bg-[#eef2e9] text-[#4b2e19] px-2 py-1 rounded-full">
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* Weight Selection */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#2D2D2D]">Select Weight:</label>
                      <select className="w-full border border-[#4b2e19]/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f5d26a]/50 focus:border-[#f5d26a]">
                        {item.weights.map((weight, weightIdx) => (
                          <option key={weightIdx} value={weight.value}>
                            {weight.value} - ₹{weight.price} (Save ₹{weight.originalPrice - weight.price})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Price and Add to Cart */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-[#4b2e19]">₹{item.currentPrice}</span>
                          <span className="text-sm text-[#2D2D2D]/60 line-through">₹{item.originalPrice}</span>
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                            Save ₹{item.savings}
                          </span>
                        </div>
                        <div className="text-xs text-[#2D2D2D]/70">
                          {item.totalBuys}+ happy customers
                        </div>
                      </div>
                      <button className="bg-[#2f4f2f] text-white text-sm px-4 py-2 rounded-full hover:bg-[#3d6d3d] transition-colors duration-200 font-medium">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Why Choose Anura */}
      <section className="relative z-30 py-20 bg-[#4b2e19]">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">WHY ANURA?</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-12">
              {[
                {
                  title: "100% Pure",
                  icon: (
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )
                },
                {
                  title: "Farm Fresh",
                  icon: (
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )
                },
                {
                  title: "Made in Small Batches",
                  icon: (
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  )
                },
                {
                  title: "Rooted in Tradition",
                  icon: (
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  )
                },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 border-2 border-white rounded-full flex items-center justify-center mb-4 text-white">
                    {item.icon}
                  </div>
                  <span className="text-white text-sm font-medium">{item.title}</span>
                </div>
              ))}
            </div>

            <button className="bg-white text-[#4b2e19] px-8 py-3 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors duration-300">
              OUR STORY
            </button>
          </div>
        </div>
      </section>

      {/* Client Reviews */}
      <section className="py-16 md:py-20 bg-[#eef2e9]">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-[#2D2D2D] mb-2">
                Client <span className="text-[#4b2e19] relative">
                  Reviews
                  <div className="absolute -bottom-1 left-0 right-0 h-1 bg-[#f5d26a] rounded-full"></div>
                </span>
              </h2>
              <p className="text-[#2D2D2D]/70 text-lg">Hear what our satisfied customers have to say about their experiences.</p>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors">
                <svg className="w-5 h-5 text-[#2D2D2D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="w-10 h-10 bg-[#4b2e19] hover:bg-[#2f4f2f] rounded-full flex items-center justify-center transition-colors">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Map-like Visual */}
            <div className="relative">
              <div className="relative">
                {/* Background Circle */}
                <div className="w-96 h-96 bg-white rounded-full shadow-lg mx-auto relative overflow-hidden">
                  {/* Overlay Circle */}
                  <div className="absolute top-8 left-8 w-80 h-80 bg-gradient-to-br from-[#eef2e9] to-[#f0f4e8] rounded-full"></div>

                  {/* Product Regions */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="grid grid-cols-3 gap-2 p-8">

                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-[#f5d26a]/30 rounded-full"></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 border-2 border-[#4b2e19]/20 rounded-full"></div>
              </div>
            </div>

            {/* Right Side - Testimonial Card */}
            <div className="relative">
              {/* Chat Icon */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#4b2e19] rounded-full flex items-center justify-center shadow-lg z-10">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>

              {/* Testimonial Card */}
              <div className="bg-white rounded-2xl shadow-lg p-8 ml-4">
                <div className="space-y-4">
                  {/* Quote */}
                  <p className="text-[#2D2D2D] text-lg leading-relaxed">
                  &quot;The quality of Anura&apos;s A2 ghee is absolutely exceptional! Every time I cook with it, the aroma fills my entire kitchen just like my grandmother&apos;s recipes. The rotis puff up perfectly and the taste is divine.&quot;
                  </p>

                  {/* Reviewer Info */}
                  <div className="space-y-1">
                    <div className="font-bold text-[#2D2D2D] text-lg">Meera Sharma</div>
                    <div className="text-[#2D2D2D]/70">Home Chef & Food Blogger</div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <span className="text-[#4b2e19] font-bold">5.0</span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-[#f5d26a]" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.176 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81H6.93a1 1 0 00.95-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Testimonials (Hidden by default, can be shown with navigation) */}
          <div className="hidden">
            {/* Second Testimonial */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                {/* Same map visual */}
              </div>
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#4b2e19] rounded-full flex items-center justify-center shadow-lg z-10">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-8 ml-4">
                  <div className="space-y-4">
                    <p className="text-[#2D2D2D] text-lg leading-relaxed">
                    &quot;After trying countless oils, I finally found one that doesn&apos;t feel heavy on the stomach. My pakoras are crisp and light, just like my mother used to make. The difference in quality is remarkable.&quot;
                    </p>
                    <div className="space-y-1">
                      <div className="font-bold text-[#2D2D2D] text-lg">Karthik Reddy</div>
                      <div className="text-[#2D2D2D]/70">Restaurant Owner</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#4b2e19] font-bold">4.8</span>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg key={i} className="w-5 h-5 text-[#f5d26a]" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.176 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81H6.93a1 1 0 00.95-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Tradition Banner - Creative Heritage Showcase */}
      <section className="relative pb-20 md:pb-24 bg-gradient-to-br from-[#fdf7f2] via-[#f8f4e6] to-[#f0e6d2] overflow-hidden">
        {/* Wave back to cream before Footer */}
        <div aria-hidden className="relative z-20 mb-10">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block w-full h-[70px] md:h-[90px] text-[#eef2e9] fill-current">
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
                  <div className="w-12 h-12 bg-gradient-to-br from-[#f5d26a] to-[#e6b800] rounded-full flex items-center justify-center text-xl shadow-lg">
                    🏺
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#4b2e19] mb-2">Bilona-Churned Excellence</h3>
                    <p className="text-[#2D2D2D]/70 leading-relaxed">Our ghee is made using the traditional bilona method — a slow, patient process that preserves every ounce of nutrition and flavor.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#2f4f2f] to-[#4b2e19] rounded-full flex items-center justify-center text-xl shadow-lg">
                    🌿
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#4b2e19] mb-2">Cold-Pressed Purity</h3>
                    <p className="text-[#2D2D2D]/70 leading-relaxed">No heat, no chemicals, no compromise. Our oils retain their natural goodness through gentle cold-pressing.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#8B4513] to-[#D2691E] rounded-full flex items-center justify-center text-xl shadow-lg">
                    🌾
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#4b2e19] mb-2">Farm-to-Table Freshness</h3>
                    <p className="text-[#2D2D2D]/70 leading-relaxed">Directly sourced from small family farms, ensuring maximum freshness and supporting local communities.</p>
                  </div>
                </div>
              </div>

              {/* Tradition badges */}
              <div className="flex flex-wrap gap-4 pt-6">
                <div className="bg-gradient-to-r from-[#f5d26a] to-[#e6b800] text-[#4b2e19] px-6 py-3 rounded-full font-semibold shadow-lg">
                  🏺 Bilona-churned
                </div>
                <div className="bg-gradient-to-r from-[#2f4f2f] to-[#4b2e19] text-white px-6 py-3 rounded-full font-semibold shadow-lg">
                  🌿 Cold-pressed
                </div>
                <div className="bg-white border-2 border-[#4b2e19]/20 text-[#4b2e19] px-6 py-3 rounded-full font-semibold shadow-lg">
                  🌾 No preservatives
                </div>
              </div>
            </div>

            {/* Right side - Visual */}
            <div className="relative">
              <div className="relative">
                {/* Main decorative circle */}
                <div className="w-96 h-96 mx-auto bg-gradient-to-br from-[#f5d26a]/20 via-[#e6b800]/10 to-[#2f4f2f]/20 rounded-full relative overflow-hidden shadow-2xl">
                  {/* Inner circles */}
                  <div className="absolute inset-8 bg-white/30 rounded-full backdrop-blur-sm"></div>
                  <div className="absolute inset-16 bg-gradient-to-br from-[#f5d26a]/40 to-[#4b2e19]/20 rounded-full backdrop-blur-sm"></div>

                  {/* Central content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6">
                    <div className="text-8xl">🏺</div>
                    <div className="text-center space-y-2">
                      <div className="text-2xl font-bold text-[#4b2e19]">Since 1985</div>
                      <div className="text-[#2D2D2D]/70 text-sm">Three generations of traditional wisdom</div>
                    </div>
                  </div>

                  {/* Floating tradition elements */}
                  <div className="absolute top-8 right-8 w-16 h-16 bg-white/40 rounded-full backdrop-blur-sm flex items-center justify-center text-2xl shadow-lg">
                    🧈
                  </div>
                  <div className="absolute bottom-8 left-8 w-16 h-16 bg-white/40 rounded-full backdrop-blur-sm flex items-center justify-center text-2xl shadow-lg">
                    🌾
                  </div>
                  <div className="absolute top-1/2 left-4 w-12 h-12 bg-white/30 rounded-full backdrop-blur-sm flex items-center justify-center text-xl shadow-lg">
                    🌿
                  </div>
                  <div className="absolute top-1/2 right-4 w-12 h-12 bg-white/30 rounded-full backdrop-blur-sm flex items-center justify-center text-xl shadow-lg">
                    🥜
                  </div>

                  {/* Decorative lines */}
                  <div className="absolute top-16 right-16 w-2 h-20 bg-[#f5d26a]/40 rounded-full transform rotate-12"></div>
                  <div className="absolute bottom-16 left-16 w-2 h-16 bg-[#4b2e19]/30 rounded-full transform -rotate-12"></div>
                </div>

                {/* Background decorative circles */}
                <div className="absolute -top-8 -right-8 w-32 h-32 border-2 border-[#f5d26a]/30 rounded-full"></div>
                <div className="absolute -bottom-8 -left-8 w-24 h-24 border-2 border-[#4b2e19]/20 rounded-full"></div>
                <div className="absolute top-1/2 -left-4 w-20 h-20 border-2 border-[#2f4f2f]/20 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
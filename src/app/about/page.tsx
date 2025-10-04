'use client'
import React from "react";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <>
      <TopBar />
      <main className="min-h-screen bg-gradient-to-br from-[#fdf7f2] via-[#f8f4e6] to-[#f0e6d2] relative overflow-hidden pt-20">
         {/* Hero Section with Video */}
         <div className="relative pt-16 md:pt-20">
           <div className="container mx-auto px-4">
             <div className="text-center mb-16">
               <div className="inline-block relative">
                 <h1 className="text-5xl md:text-7xl font-[Pacifico] text-[#4b2e19] mb-4">
                   Our <span className="text-[#f5d26a]">Story</span>
                 </h1>
                 <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-[#f5d26a] to-[#4b2e19] rounded-full"></div>
               </div>
               <p className="text-xl text-[#2D2D2D]/70 mt-6 max-w-3xl mx-auto leading-relaxed">
                 Reviving the ancient wisdom of Old Bharat, we bring you pure, traditional products crafted with the same love and dedication that our ancestors used for generations.
               </p>
             </div>

             {/* Video Section */}
             <div className="max-w-5xl mx-auto mb-20">
               <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#f5d26a]/20">
                 <div className="aspect-video bg-gradient-to-br from-[#4b2e19] to-[#2f4f2f] flex items-center justify-center">
                   {/* YouTube Video Placeholder - Replace with actual video ID */}
                   <iframe
                     className="w-full h-full rounded-2xl"
                     src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=example"
                     title="Our Farm Story - YugaFarms"
                     frameBorder="0"
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                     allowFullScreen
                   ></iframe>
                 </div>
                 {/* Decorative Elements */}
                 <div className="absolute -top-6 -left-6 w-20 h-20 border-3 border-[#f5d26a]/40 rounded-full"></div>
                 <div className="absolute -bottom-6 -right-6 w-16 h-16 border-3 border-[#4b2e19]/30 rounded-full"></div>
                 <div className="absolute top-1/2 -left-3 w-12 h-12 border-2 border-[#2f4f2f]/20 rounded-full"></div>
                 <div className="absolute top-1/4 -right-3 w-8 h-8 border-2 border-[#f5d26a]/30 rounded-full"></div>
               </div>
               
               {/* Video Caption */}
               <div className="text-center mt-6">
                 <p className="text-[#2D2D2D]/60 italic text-lg">
                 &quot;Watch our journey from farm to your table, preserving traditions that have nourished families for centuries.&quot;
                 </p>
               </div>
             </div>
           </div>
         </div>

         {/* Wave into About Content */}
         <div aria-hidden className="relative z-20 -mt-2">
           <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block w-full h-[70px] md:h-[90px] text-[#eef2e9] fill-current">
             <path d="M0,80 C120,40 240,120 360,80 S600,40 720,80 960,120 1080,80 1320,40 1440,80 L1440,120 L0,120 Z"></path>
           </svg>
         </div>

        {/* Our Heritage Section */}
        <section className="py-20 md:py-24 bg-[#eef2e9]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-[Pacifico] text-[#4b2e19] mb-6">Reviving Ancient Wisdom</h2>
              <p className="text-xl text-[#2D2D2D]/70 max-w-4xl mx-auto leading-relaxed">
                In a world rushing towards modernity, we chose to slow down and embrace the timeless wisdom of our ancestors. 
                Every product we create is a testament to the ancient art of pure, natural food preparation.
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              {/* Main Story Section */}
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 mb-16 border border-[#4b2e19]/10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  {/* Left Side - Story */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#f5d26a] to-[#e6b800] rounded-full flex items-center justify-center text-2xl shadow-lg">
                        🏺
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-[#4b2e19]">The Journey Begins</h3>
                        <p className="text-[#f5d26a] font-semibold">Since 1985</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4 text-[#2D2D2D]/80 leading-relaxed">
                      <p className="text-lg">
                        It all started in a small village kitchen, where our grandmother would wake up before dawn to churn ghee using the traditional bilona method. 
                        The rhythmic sound of the wooden churner, the golden hue of pure ghee, and the aroma that filled the entire house - these memories became our foundation.
                      </p>
                      <p>
                        Today, we continue this sacred tradition, but with a mission: to bring this ancient wisdom to modern families who value purity, health, and authenticity. 
                        Every jar of our ghee and every drop of our honey carries the essence of those early morning rituals.
                      </p>
                      <p>
                        We work directly with small family farms across India, ensuring that our products not only maintain their traditional quality but also support 
                        the communities that have preserved these methods for generations.
                      </p>
                    </div>
                  </div>

                  {/* Right Side - Visual */}
                  <div className="relative">
                    <div className="w-80 h-80 mx-auto bg-gradient-to-br from-[#f5d26a]/20 via-[#e6b800]/10 to-[#2f4f2f]/20 rounded-full relative overflow-hidden shadow-2xl">
                      {/* Inner circles */}
                      <div className="absolute inset-6 bg-white/40 rounded-full backdrop-blur-sm"></div>
                      <div className="absolute inset-12 bg-gradient-to-br from-[#f5d26a]/50 to-[#4b2e19]/30 rounded-full backdrop-blur-sm"></div>

                      {/* Central content */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                        <div className="text-6xl">🏺</div>
                        <div className="text-center space-y-1">
                          <div className="text-xl font-bold text-[#4b2e19]">Traditional</div>
                          <div className="text-[#2D2D2D]/70 text-sm">Bilona Method</div>
                        </div>
                      </div>

                      {/* Floating elements */}
                      <div className="absolute top-6 right-6 w-12 h-12 bg-white/50 rounded-full backdrop-blur-sm flex items-center justify-center text-lg shadow-lg">
                        🧈
                      </div>
                      <div className="absolute bottom-6 left-6 w-12 h-12 bg-white/50 rounded-full backdrop-blur-sm flex items-center justify-center text-lg shadow-lg">
                        🍯
                      </div>
                      <div className="absolute top-1/2 left-3 w-8 h-8 bg-white/40 rounded-full backdrop-blur-sm flex items-center justify-center text-sm shadow-lg">
                        🌾
                      </div>
                      <div className="absolute top-1/2 right-3 w-8 h-8 bg-white/40 rounded-full backdrop-blur-sm flex items-center justify-center text-sm shadow-lg">
                        🌿
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Heritage Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center p-6 bg-white/40 rounded-2xl border border-[#4b2e19]/10">
                  <div className="text-4xl font-bold text-[#4b2e19] mb-2">38+</div>
                  <div className="text-sm text-[#2D2D2D]/70 font-medium">Years of Tradition</div>
                </div>
                <div className="text-center p-6 bg-white/40 rounded-2xl border border-[#4b2e19]/10">
                  <div className="text-4xl font-bold text-[#4b2e19] mb-2">50K+</div>
                  <div className="text-sm text-[#2D2D2D]/70 font-medium">Happy Families</div>
                </div>
                <div className="text-center p-6 bg-white/40 rounded-2xl border border-[#4b2e19]/10">
                  <div className="text-4xl font-bold text-[#4b2e19] mb-2">100%</div>
                  <div className="text-sm text-[#2D2D2D]/70 font-medium">Natural Products</div>
                </div>
                <div className="text-center p-6 bg-white/40 rounded-2xl border border-[#4b2e19]/10">
                  <div className="text-4xl font-bold text-[#4b2e19] mb-2">3</div>
                  <div className="text-sm text-[#2D2D2D]/70 font-medium">Generations</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Promise Section */}
        <section className="py-20 md:py-24 bg-gradient-to-br from-[#fdf7f2] to-[#f8f4e6]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-[Pacifico] text-[#4b2e19] mb-6">Our Sacred Promise</h2>
              <p className="text-xl text-[#2D2D2D]/70 max-w-4xl mx-auto leading-relaxed">
                To you, our extended family, we make these solemn commitments that guide every decision we make, 
                every product we create, and every relationship we build.
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {[
                  {
                    icon: "🌿",
                    title: "100% Natural Ingredients",
                    description: "We use only the finest, whole ingredients in all our products. No artificial additives, no preservatives, no shortcuts. Every ingredient is carefully selected for its purity and nutritional value, just as nature intended.",
                    highlight: "Pure & Natural"
                  },
                  {
                    icon: "🏺",
                    title: "Traditional Methods",
                    description: "We adhere to time-honored processes, even when they require more effort and time. Our bilona churning method for ghee and gentle extraction for honey preserve the authentic taste and health benefits that modern methods cannot replicate.",
                    highlight: "Time-Tested"
                  },
                  {
                    icon: "🐄",
                    title: "Animal Welfare",
                    description: "Our cows graze freely on open pastures, eat natural grass and feed, and are never given synthetic hormones or antibiotics. We believe that happy, healthy animals produce the finest, most nutritious products.",
                    highlight: "Ethical Sourcing"
                  },
                  {
                    icon: "🤝",
                    title: "Community First",
                    description: "We work directly with small family farms and local communities, ensuring fair trade practices and supporting the livelihoods of those who have preserved these traditional methods for generations.",
                    highlight: "Fair Trade"
                  }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-[#4b2e19]/10 hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#f5d26a] to-[#e6b800] rounded-full flex items-center justify-center text-2xl shadow-lg flex-shrink-0">
                        {item.icon}
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-2xl font-bold text-[#4b2e19] mb-2">{item.title}</h3>
                          <span className="inline-block bg-[#f5d26a]/20 text-[#4b2e19] px-3 py-1 rounded-full text-sm font-semibold">
                            {item.highlight}
                          </span>
                        </div>
                        <p className="text-[#2D2D2D]/80 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Our Process Section */}
        <section className="py-20 md:py-24 bg-[#eef2e9]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-[Pacifico] text-[#4b2e19] mb-6">The Art of Creation</h2>
              <p className="text-xl text-[#2D2D2D]/70 max-w-4xl mx-auto leading-relaxed">
                Every product we create follows a sacred ritual that has been passed down through generations. 
                This is not just a process - it&apos;s a meditation, a prayer, a celebration of nature&apos;s gifts.
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="space-y-16">
                {[
                  {
                    step: "01",
                    title: "Sacred Sourcing",
                    description: "We begin at dawn, visiting our trusted partner farms where cows graze freely on organic pastures. We select only the finest, freshest milk from grass-fed cows and pure honey from specific flower sources, ensuring each ingredient carries the essence of its natural environment.",
                    icon: "🌾",
                    detail: "Farm Visits at Dawn"
                  },
                  {
                    step: "02", 
                    title: "Traditional Preparation",
                    description: "In our traditional kitchen, we use the ancient bilona churning method for ghee - a slow, rhythmic process that takes hours but preserves every nutrient. For honey, we practice gentle extraction that maintains the natural enzymes and pollen that make it truly beneficial.",
                    icon: "🏺",
                    detail: "Hand-Churned for Hours"
                  },
                  {
                    step: "03",
                    title: "Rigorous Testing",
                    description: "Every batch undergoes comprehensive testing in our laboratory to ensure purity, authenticity, and nutritional value. We test for adulteration, check nutritional content, and verify that our products meet the highest standards of quality and safety.",
                    icon: "🔬",
                    detail: "Lab Tested & Verified"
                  },
                  {
                    step: "04",
                    title: "Blessed Packaging",
                    description: "Each product is carefully packaged in food-grade containers that preserve freshness and purity. We treat this final step as a blessing, ensuring that when our products reach your home, they carry the same love and care with which they were created.",
                    icon: "📦",
                    detail: "Packaged with Love"
                  }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-[#4b2e19]/10">
                    <div className="flex flex-col lg:flex-row items-center gap-8">
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <div className="w-24 h-24 bg-gradient-to-br from-[#f5d26a] to-[#e6b800] rounded-full flex items-center justify-center text-3xl shadow-2xl">
                            {item.icon}
                          </div>
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#4b2e19] text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {item.step}
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 text-center lg:text-left">
                        <div className="mb-4">
                          <h3 className="text-3xl font-bold text-[#4b2e19] mb-2">{item.title}</h3>
                          <span className="inline-block bg-[#f5d26a]/20 text-[#4b2e19] px-4 py-2 rounded-full text-sm font-semibold">
                            {item.detail}
                          </span>
                        </div>
                        <p className="text-[#2D2D2D]/80 leading-relaxed text-lg">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Family Section */}
        {/* <section className="py-20 md:py-24 bg-gradient-to-br from-[#fdf7f2] to-[#f8f4e6]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-[Pacifico] text-[#4b2e19] mb-6">Our Extended Family</h2>
              <p className="text-xl text-[#2D2D2D]/70 max-w-4xl mx-auto leading-relaxed">
                Behind every jar of ghee and every drop of honey, there are passionate individuals who have dedicated 
                their lives to preserving these ancient traditions and bringing them to your table.
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {[
                  {
                    name: "Rajesh Kumar",
                    role: "Founder & Master Craftsman",
                    description: "The heart and soul of YugaFarms, Rajesh learned the art of traditional ghee making from his grandmother. With 38 years of experience, he personally oversees every batch, ensuring that the ancient bilona method is followed with the same reverence as it was centuries ago.",
                    emoji: "👨‍🌾",
                    quote: "Every drop of ghee carries the love of three generations."
                  },
                  {
                    name: "Priya Sharma",
                    role: "Quality Guardian",
                    description: "Priya brings scientific rigor to our traditional methods. As our Quality Director, she ensures that every product not only meets our high standards but exceeds them. Her laboratory is where tradition meets modern science, creating products that are both authentic and safe.",
                    emoji: "👩‍🔬",
                    quote: "Quality is not just a standard, it's our promise to your family."
                  },
                  {
                    name: "Arjun Kumar",
                    role: "Bridge to Communities",
                    description: "Arjun is our connection to the farming communities that make our work possible. He travels across India, building relationships with small family farms, ensuring fair trade practices, and helping preserve traditional farming methods for future generations.",
                    emoji: "🤝",
                    quote: "Every farmer is a partner in our mission of purity."
                  }
                ].map((person, idx) => (
                  <div key={idx} className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-[#4b2e19]/10 hover:shadow-2xl transition-all duration-300">
                    <div className="text-center space-y-6">
                      <div className="text-8xl">{person.emoji}</div>
                      <div>
                        <h3 className="text-2xl font-bold text-[#4b2e19] mb-2">{person.name}</h3>
                        <p className="text-[#f5d26a] font-semibold text-lg">{person.role}</p>
                      </div>
                      <p className="text-[#2D2D2D]/80 leading-relaxed text-sm">
                        {person.description}
                      </p>
                      <div className="bg-[#f5d26a]/10 rounded-2xl p-4 border-l-4 border-[#f5d26a]">
                        <p className="text-[#4b2e19] italic font-medium">
                          "{person.quote}"
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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

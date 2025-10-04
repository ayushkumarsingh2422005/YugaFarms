'use client'
import React from "react";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";

export default function LabReportsPage() {
  return (
    <>
      <TopBar />
      <main className="min-h-screen bg-gradient-to-br from-[#fdf7f2] via-[#f8f4e6] to-[#f0e6d2] relative overflow-hidden pt-20">
         {/* Hero Section */}
         <div className="relative pt-16 md:pt-20">
           <div className="container mx-auto px-4">
             <div className="text-center mb-16">
               <div className="inline-block relative">
                 <h1 className="text-5xl md:text-7xl font-[Pacifico] text-[#4b2e19] mb-4">
                   Lab <span className="text-[#f5d26a]">Test Reports</span>
                 </h1>
                 <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-[#f5d26a] to-[#4b2e19] rounded-full"></div>
               </div>
               <p className="text-xl text-[#2D2D2D]/70 mt-6 max-w-4xl mx-auto leading-relaxed">
                 Transparency is the foundation of trust. Every batch of our products undergoes rigorous testing 
                 to ensure purity, authenticity, and safety. Here are our latest lab test reports.
               </p>
             </div>
           </div>
         </div>

         {/* Wave into Lab Reports */}
         <div aria-hidden className="relative z-20 -mt-2">
           <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block w-full h-[70px] md:h-[90px] text-[#eef2e9] fill-current">
             <path d="M0,80 C120,40 240,120 360,80 S600,40 720,80 960,120 1080,80 1320,40 1440,80 L1440,120 L0,120 Z"></path>
           </svg>
         </div>

        {/* Lab Reports Section */}
        <section className="py-16 md:py-20 bg-[#eef2e9]">
          <div className="container mx-auto px-4">
            {/* <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-[Pacifico] text-[#4b2e19] mb-4">Quality Assurance</h2>
              <p className="text-lg text-[#2D2D2D]/70 max-w-3xl mx-auto">
                Our commitment to quality is backed by comprehensive laboratory testing from certified facilities.
              </p>
            </div> */}

            {/* Lab Reports Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {[
                {
                  name: "Better Bars",
                  image: "/images/better-bars.png", // Place your image in public/images or update the path accordingly
                  pdf: "/lab-reports/better-bars.pdf", // Place your PDF in public/lab-reports or update the path accordingly
                },
                {
                  name: "Better Bars",
                  image: "/images/better-bars.png", // Place your image in public/images or update the path accordingly
                  pdf: "/lab-reports/better-bars.pdf", // Place your PDF in public/lab-reports or update the path accordingly
                },
                {
                  name: "Better Bars",
                  image: "/images/better-bars.png", // Place your image in public/images or update the path accordingly
                  pdf: "/lab-reports/better-bars.pdf", // Place your PDF in public/lab-reports or update the path accordingly
                },
                {
                  name: "Better Bars",
                  image: "/images/better-bars.png", // Place your image in public/images or update the path accordingly
                  pdf: "/lab-reports/better-bars.pdf", // Place your PDF in public/lab-reports or update the path accordingly
                },
                {
                  name: "Better Bars",
                  image: "/images/better-bars.png", // Place your image in public/images or update the path accordingly
                  pdf: "/lab-reports/better-bars.pdf", // Place your PDF in public/lab-reports or update the path accordingly
                },
                // Add more products here as needed
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-none flex flex-col items-center p-0 pb-6"
                >
                  <div className="w-full flex-1 flex items-center justify-center p-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="rounded-xl object-contain w-full h-64"
                      style={{
                        background: "#fff",
                        borderRadius: "1.25rem",
                        boxShadow: "0 1px 4px 0 rgba(0,0,0,0.03)",
                        marginTop: "8px",
                        marginBottom: "8px",
                      }}
                    />
                  </div>
                  <div className="w-full text-center mt-2">
                    <div className="text-lg font-medium text-[#222] mb-1">{item.name}</div>
                    <button
                      onClick={() => window.open(item.pdf, "_blank")}
                      className="mt-2 text-[#222] font-semibold tracking-wide underline underline-offset-4 decoration-[#222] hover:text-[#4b2e19] transition-colors text-base"
                      style={{
                        letterSpacing: "0.02em",
                      }}
                    >
                      CHECK LAB TEST REPORT
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Lab Information */}
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-[#4b2e19]/10">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-[#4b2e19] mb-4">Certified Testing Laboratories</h3>
                <p className="text-[#2D2D2D]/70 max-w-3xl mx-auto">
                  We partner with NABL (National Accreditation Board for Testing and Calibration Laboratories) 
                  certified facilities to ensure the highest standards of testing and accuracy.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    name: "Food Safety & Standards Authority of India",
                    certification: "FSSAI Certified",
                    tests: "Purity, Adulteration, Nutritional Analysis"
                  },
                  {
                    name: "National Dairy Research Institute",
                    certification: "NDRI Approved",
                    tests: "Dairy Product Quality, Microbiological Testing"
                  },
                  {
                    name: "Central Food Technological Research Institute",
                    certification: "CFTRI Certified",
                    tests: "Advanced Food Analysis, Heavy Metals Testing"
                  }
                ].map((lab, idx) => (
                  <div key={idx} className="text-center p-6 bg-white/40 rounded-2xl border border-[#4b2e19]/10">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#f5d26a] to-[#e6b800] rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                      🔬
                    </div>
                    <h4 className="font-bold text-[#4b2e19] mb-2">{lab.name}</h4>
                    <p className="text-[#f5d26a] font-semibold text-sm mb-3">{lab.certification}</p>
                    <p className="text-[#2D2D2D]/70 text-sm">{lab.tests}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Quality Standards Section */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-[#fdf7f2] to-[#f8f4e6]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-[Pacifico] text-[#4b2e19] mb-4">Our Quality Standards</h2>
              <p className="text-lg text-[#2D2D2D]/70 max-w-3xl mx-auto">
                Every product meets or exceeds the highest international quality standards.
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    icon: "✅",
                    title: "100% Pure",
                    description: "No adulteration, no artificial additives, no preservatives"
                  },
                  {
                    icon: "🔬",
                    title: "Lab Tested",
                    description: "Every batch tested by certified laboratories"
                  },
                  {
                    icon: "📋",
                    title: "FSSAI Approved",
                    description: "Compliant with all food safety regulations"
                  },
                  {
                    icon: "🌿",
                    title: "Natural",
                    description: "Made using traditional methods, no chemicals"
                  }
                ].map((standard, idx) => (
                  <div key={idx} className="text-center space-y-4 p-6 bg-white/50 rounded-2xl border border-[#4b2e19]/10 hover:shadow-lg transition-shadow duration-300">
                    <div className="text-5xl">{standard.icon}</div>
                    <h3 className="text-xl font-bold text-[#4b2e19]">{standard.title}</h3>
                    <p className="text-[#2D2D2D]/70 text-sm leading-relaxed">{standard.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Download Section */}
        <section className="py-16 md:py-20 bg-[#eef2e9]">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-[Pacifico] text-[#4b2e19] mb-6">Download All Reports</h2>
              <p className="text-lg text-[#2D2D2D]/70 mb-8">
                Get access to all our lab test reports in one convenient package.
              </p>
              
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-[#4b2e19]/10">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#f5d26a] to-[#e6b800] rounded-full flex items-center justify-center text-2xl">
                    📄
                  </div>
                  <div className="text-left">
                    <h3 className="text-2xl font-bold text-[#4b2e19]">Complete Lab Reports Package</h3>
                    <p className="text-[#2D2D2D]/70">All test reports from the last 6 months</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="text-center p-4 bg-white/40 rounded-xl">
                    <div className="text-2xl font-bold text-[#4b2e19]">24+</div>
                    <div className="text-sm text-[#2D2D2D]/70">Test Reports</div>
                  </div>
                  <div className="text-center p-4 bg-white/40 rounded-xl">
                    <div className="text-2xl font-bold text-[#4b2e19]">6</div>
                    <div className="text-sm text-[#2D2D2D]/70">Months Coverage</div>
                  </div>
                  <div className="text-center p-4 bg-white/40 rounded-xl">
                    <div className="text-2xl font-bold text-[#4b2e19]">100%</div>
                    <div className="text-sm text-[#2D2D2D]/70">Pass Rate</div>
                  </div>
                  <div className="text-center p-4 bg-white/40 rounded-xl">
                    <div className="text-2xl font-bold text-[#4b2e19]">3</div>
                    <div className="text-sm text-[#2D2D2D]/70">Certified Labs</div>
                  </div>
                </div>

                <button className="bg-[#4b2e19] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#2f4f2f] transition-colors duration-300 shadow-lg hover:shadow-xl flex items-center gap-3 mx-auto">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download All Reports (PDF)
                </button>
              </div>
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

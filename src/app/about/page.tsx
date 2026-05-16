'use client'
import React, { useEffect, useState, useRef } from "react";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import Image from "next/image";

const PAGE_X = "px-4 sm:px-6 md:px-10 lg:px-14 xl:px-16";

export default function AboutPage() {
  const [counters, setCounters] = useState({ years: 0, families: 0, natural: 0, generations: 0 });
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const animateCounter = (target: number, key: keyof typeof counters, duration: number = 2000) => {
            let start = 0;
            const increment = target / (duration / 16);
            const timer = setInterval(() => {
              start += increment;
              if (start >= target) {
                setCounters(prev => ({ ...prev, [key]: target }));
                clearInterval(timer);
              } else {
                setCounters(prev => ({ ...prev, [key]: Math.floor(start) }));
              }
            }, 16);
          };

          animateCounter(10, 'years');
          animateCounter(2, 'families');
          animateCounter(100, 'natural');
          animateCounter(2, 'generations');
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <TopBar />
      <main className="min-h-screen w-full bg-[#fdfbf7] relative overflow-hidden pt-3 md:pt-4">
        {/* Hero */}
        <section className={`w-full pb-6 md:pb-8 ${PAGE_X}`}>
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-[Pacifico] text-[#4b2e19] mb-3">
              Our <span className="text-[#f5d26a]">Story</span>
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-[#2D2D2D]/70 leading-relaxed">
              Reviving the ancient wisdom of Old Bharat, we bring you pure, traditional products crafted with the same love and dedication that our ancestors used for generations.
            </p>
          </div>

          <div className="flex justify-center w-full">
            <div className="relative w-full max-w-5xl lg:max-w-6xl xl:max-w-7xl rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(75,46,25,0.1)] bg-[#f5f2ea]">
              <div className="relative aspect-video w-full max-h-[min(70vh,720px)]">
              <video
                className="absolute inset-0 w-full h-full object-cover object-center"
                autoPlay
                muted
                loop
                playsInline
                controls
              >
                <source src="/about.MP4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              </div>
            </div>
          </div>
          <p className="text-center text-sm md:text-base text-[#2D2D2D]/55 italic mt-3">
            Watch our journey from farm to your table, preserving traditions that have nourished families for centuries.
          </p>
        </section>

        {/* Story */}
        <section className={`w-full py-8 md:py-10 border-t border-[#f0ebe3] ${PAGE_X}`}>
          <h2 className="text-sm md:text-base font-bold text-[#4b2e19] text-center mb-6 md:mb-8 tracking-wide uppercase">
            Our Mission
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 text-[#2D2D2D]/75 text-sm md:text-base lg:text-[17px] leading-relaxed">
            <div className="space-y-4">
              <p>
                At Yuga Farms, our journey began with a question: in a world where everything moves faster, where meals are grabbed, packaged, processed, how well do we really know what we&apos;re eating? We watched as real food?grown and made with care?became overshadowed by convenience, shortcuts, and hidden processing.
              </p>
              <p>
                We remembered how it used to be: a spoon of warm ghee on simple chapati, the fragrance of golden clarity, the rhythm of seasons and soil and cow and kitchen all working together. We remembered how our elders knew what they were eating and how, how they respected the cow, the land, the churn, the flame.
              </p>
              <p>
                So we created Yuga Farms with one clear mission: to bring back right food?the kind our ancestors trusted?so that every home can hold onto the traditions of old Bharat, and every body can benefit from what genuine nourishment offers. Our focus is simple yet profound: cow ghee, crafted the way it was meant to be.
              </p>
            </div>

            <div className="space-y-4">
              <p className="font-semibold text-[#4b2e19]">Here&apos;s what we do differently:</p>
              <ul className="space-y-2 pl-0 list-none">
                {[
                  "We raise our cows with dignity, on clean feed, free from the shortcuts of industrial production.",
                  "We churn and clarify the ghee using traditional, careful methods?so the flavour, the nutrients, the integrity remain.",
                  "We believe that modern manufacturing of fat and oils often loses the soul, the health, and the story of what food should be.",
                  "Because research shows that cow ghee made with proper methods offers real benefits: for digestion, immunity, brain function and more.",
                ].map((text, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-[#f5d26a] font-bold shrink-0">{"\u2022"}</span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
              <p>
                Whether you&apos;re sitting down with your family for a home-cooked meal, or pausing for a quiet celebration, or simply choosing how to nourish yourself on a busy day ? Yuga Farms is here so that what you put on your plate does more than satisfy hunger. It honours the land, the cow, the churn, the tradition.
              </p>
              <p className="font-semibold text-[#4b2e19]">
                Because for us at Yuga Farms ? ghee isn&apos;t just a cooking fat. It&apos;s the golden thread between tradition and health.
              </p>
            </div>
          </div>

          <p className="italic text-center text-[#4b2e19]/80 pt-6 md:pt-8 text-sm md:text-base">
            Yuga Farms ? where tradition meets health; where genuine cow ghee meets care.
          </p>

          <div
            ref={statsRef}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 lg:gap-12 mt-10 pt-8 border-t border-[#f0ebe3]"
          >
            {[
              { value: `${counters.years}+`, label: "Years of Tradition" },
              { value: `${counters.families}K+`, label: "Happy Families" },
              { value: `${counters.natural}%`, label: "Natural Products" },
              { value: String(counters.generations), label: "Generations" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#4b2e19]">{stat.value}</div>
                <div className="text-xs md:text-sm lg:text-base text-[#2D2D2D]/60 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Founders */}
        <section className={`w-full py-8 md:py-10 border-t border-[#f0ebe3] bg-white ${PAGE_X}`}>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#4b2e19] text-center mb-6 md:mb-8">
            A Note From Our Founders
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-12 text-[#2D2D2D]/75 text-sm md:text-base lg:text-[17px] leading-relaxed">
            <p>
              We&apos;re <span className="font-semibold text-[#4b2e19]">Vishal & Deepak</span> ? two friends inspired by India&apos;s food heritage and concerned about a world where meals are rushed and real nourishment is forgotten. In the rush of modern life, we asked: Do we really know what we&apos;re eating?
            </p>
            <p>
              At Yuga Farms, we&apos;ve chosen a different path. Our focus is clear: bring back the richness of tradition, health, and real flavour ? starting with pure cow ghee made from the milk of our beloved indigenous Sahiwal cow.
            </p>
            <p>
              From pasture to churn to your plate, we&apos;re committed to food that honours the land, the animal, and your well-being. Because choosing our ghee isn&apos;t just about taste. It&apos;s about tradition, health and what we believe real food should be.
            </p>
          </div>
        </section>

        {/* Promise */}
        <section className={`w-full py-8 md:py-10 border-t border-[#f0ebe3] ${PAGE_X}`}>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#4b2e19] text-center mb-2">
            Our Sacred Promise
          </h2>
          <p className="text-center text-sm md:text-base lg:text-lg text-[#2D2D2D]/65 mb-8 md:mb-10 leading-relaxed">
            To you, our extended family, we make these solemn commitments that guide every decision we make,
            every product we create, and every relationship we build.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 lg:gap-10">
            {[
              {
                icon: "/about/natural.png",
                title: "100% Natural Ingredients",
                description: "We use only the finest, whole ingredients in all our products. No artificial additives, no preservatives, no shortcuts.",
                highlight: "Pure & Natural",
              },
              {
                icon: "/about/traditional.png",
                title: "Traditional Methods",
                description: "Our bilona churning method for ghee and gentle extraction for honey preserve authentic taste and health benefits.",
                highlight: "Time-Tested",
              },
              {
                icon: "/about/animal.png",
                title: "Animal Welfare",
                description: "Our cows graze freely on open pastures, eat natural feed, and are never given synthetic hormones or antibiotics.",
                highlight: "Ethical Sourcing",
              },
              {
                icon: "/about/community.png",
                title: "Community First",
                description: "We work directly with small family farms and local communities, ensuring fair trade and supporting traditional livelihoods.",
                highlight: "Fair Trade",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 items-start">
                <div className="w-14 h-14 lg:w-16 lg:h-16 shrink-0 flex items-center justify-center">
                  <Image src={item.icon} alt="" width={64} height={64} className="w-full h-full object-contain" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-[#4b2e19] mb-0.5 text-base lg:text-lg">{item.title}</h3>
                  <span className="text-xs font-semibold text-[#4b2e19]/70 uppercase tracking-wide">{item.highlight}</span>
                  <p className="text-sm lg:text-base text-[#2D2D2D]/65 leading-relaxed mt-2">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Process */}
        <section className={`w-full py-8 md:py-10 border-t border-[#f0ebe3] bg-white ${PAGE_X}`}>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#4b2e19] text-center mb-2">
            The Art of Creation
          </h2>
          <p className="text-center text-sm md:text-base lg:text-lg text-[#2D2D2D]/65 mb-8 md:mb-10 leading-relaxed">
            Every product follows a sacred ritual passed down through generations ? not just a process, but a celebration of nature&apos;s gifts.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 lg:gap-x-16 gap-y-8 lg:gap-y-10">
            {[
              {
                step: "01",
                title: "Sacred Sourcing",
                description: "We begin at dawn, visiting trusted partner farms where cows graze freely. We select only the finest milk and pure honey from specific flower sources.",
                icon: "/images/sacredsourcing.png",
                detail: "Farm Visits at Dawn",
              },
              {
                step: "02",
                title: "Traditional Preparation",
                description: "We use the ancient bilona churning method for ghee ? a slow process that preserves every nutrient. Honey is gently extracted to maintain natural enzymes.",
                icon: "/images/traditionalpreparation.png",
                detail: "Hand-Churned for Hours",
              },
              {
                step: "03",
                title: "Rigorous Testing",
                description: "Every batch undergoes comprehensive testing for purity, authenticity, and nutritional value before it reaches your home.",
                icon: "/images/rigoroustesting.png",
                detail: "Lab Tested & Verified",
              },
              {
                step: "04",
                title: "Blessed Packaging",
                description: "Each product is packaged in food-grade containers that preserve freshness ? carried to you with the same care with which it was created.",
                icon: "/images/blessedpackaging.png",
                detail: "Packaged with Love",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 md:gap-5 items-start border-b border-[#f0ebe3] pb-6 md:pb-8 last:border-0">
                <div className="relative shrink-0 w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24">
                  <Image src={item.icon} alt="" width={96} height={96} className="w-full h-full object-contain" />
                  <span className="absolute -top-1 -right-1 w-6 h-6 md:w-7 md:h-7 bg-[#4b2e19] text-white rounded-full text-[10px] md:text-xs font-bold flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-[#4b2e19]/60 mb-1">{item.detail}</p>
                  <h3 className="text-lg md:text-xl font-bold text-[#4b2e19] mb-2">{item.title}</h3>
                  <p className="text-sm md:text-base text-[#2D2D2D]/65 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

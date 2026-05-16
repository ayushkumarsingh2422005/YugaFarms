"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import type { Client } from "@/lib/strapiPublic";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:1337";

function useSlidesPerView() {
  const [slidesPerView, setSlidesPerView] = useState(1.15);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth >= 1024) setSlidesPerView(3.5);
      else if (window.innerWidth >= 640) setSlidesPerView(2.2);
      else setSlidesPerView(1.15);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return slidesPerView;
}

function StarRating({ rating }: { rating: number }) {
  const filled = Math.round(rating || 5);
  return (
    <div className="flex items-center gap-[2px]">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${i < filled ? "text-[#f5d26a]" : "text-[#d1d5db]"} fill-current`}
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {direction === "left" ? (
        <path d="M15 18l-6-6 6-6" />
      ) : (
        <path d="M9 18l6-6-6-6" />
      )}
    </svg>
  );
}

function TestimonialCard({ client }: { client: Client }) {
  const imageUrl = client.Image?.url
    ? `${BACKEND}${client.Image.url}`
    : "/images/client.png";

  return (
    <article className="flex h-full min-h-[200px] flex-col justify-between rounded-xl border border-[#e8e8e8] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] md:p-7">
      <p className="text-left text-[13px] leading-relaxed font-light text-[#2b2b2b] md:text-[14px]">
        {client.Review || "No review available."}
      </p>

      <div className="mt-6 flex items-center gap-3">
        <div className="h-11 w-11 flex-shrink-0 overflow-hidden rounded-full bg-[#f3f4f6] md:h-12 md:w-12">
          <Image
            src={imageUrl}
            alt={client.Image?.alternativeText || client.Name || "Customer"}
            width={48}
            height={48}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-0.5">
          <h3 className="text-[14px] font-bold text-[#1e293b] md:text-[15px]">
            {client.Name || "Anonymous"}
          </h3>
          <StarRating rating={client.Rating} />
        </div>
      </div>
    </article>
  );
}

export default function TestimonialsCarousel({ clients }: { clients: Client[] }) {
  const slidesPerView = useSlidesPerView();
  const [index, setIndex] = useState(0);

  const maxIndex = Math.max(0, Math.ceil(clients.length - slidesPerView));
  const slidePercent = 100 / slidesPerView;

  const goTo = useCallback(
    (next: number) => {
      setIndex(Math.min(Math.max(0, next), maxIndex));
    },
    [maxIndex]
  );

  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);

  if (clients.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-[#4b2e19]">No client reviews available at the moment.</p>
      </div>
    );
  }

  const dotCount = maxIndex + 1;

  return (
    <div className="w-full">
      <div className="overflow-hidden" aria-roledescription="carousel">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * slidePercent}%)` }}
        >
          {clients.map((client) => (
            <div
              key={client.id}
              className="box-border flex-shrink-0 pr-5"
              style={{ width: `${slidePercent}%` }}
            >
              <TestimonialCard client={client} />
            </div>
          ))}
        </div>
      </div>

      {clients.length > 1 && (
        <div className="mt-10 flex items-center justify-center gap-5">
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            aria-label="Previous reviews"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2f4f2f] text-[#2f4f2f] transition-colors hover:bg-[#2f4f2f]/5 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronIcon direction="left" />
          </button>

          <div className="flex items-center gap-2" role="tablist" aria-label="Review slides">
            {Array.from({ length: dotCount }).map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Go to review slide ${i + 1}`}
                onClick={() => goTo(i)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  i === index ? "bg-[#2f4f2f]" : "bg-[#d1d5db] hover:bg-[#9ca3af]"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => goTo(index + 1)}
            disabled={index >= maxIndex}
            aria-label="Next reviews"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2f4f2f] text-[#2f4f2f] transition-colors hover:bg-[#2f4f2f]/5 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronIcon direction="right" />
          </button>
        </div>
      )}
    </div>
  );
}

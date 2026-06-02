"use client";

import { useCallback, useEffect, useState } from "react";
import Script from "next/script";
import {
  INSTAGRAM_SPOTLIGHT_REELS,
  instagramReelPermalink,
} from "@/lib/instagramReels";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

function InstagramEmbed({ permalink }: { permalink: string }) {
  const href = instagramReelPermalink(permalink);

  return (
    <blockquote
      className="instagram-media !m-0 min-w-[326px] max-w-[540px]"
      data-instgrm-permalink={href}
      data-instgrm-version="14"
      style={{
        background: "#FFF",
        border: 0,
        margin: 0,
        padding: 0,
        width: "100%",
      }}
    >
      <a href={href} target="_blank" rel="noopener noreferrer">
        View on Instagram
      </a>
    </blockquote>
  );
}

export default function InstagramSpotlight() {
  const [embedReady, setEmbedReady] = useState(false);

  const processEmbeds = useCallback(() => {
    try {
      window.instgrm?.Embeds?.process();
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!embedReady) return;
    processEmbeds();
    const t = window.setTimeout(processEmbeds, 400);
    return () => window.clearTimeout(t);
  }, [embedReady, processEmbeds]);

  return (
    <section className="bg-[#eef2e9] py-10 md:py-14">
      <Script
        src="https://www.instagram.com/embed.js"
        strategy="lazyOnload"
        onLoad={() => {
          setEmbedReady(true);
          processEmbeds();
        }}
      />

      <div className="container mx-auto px-4">
        <h2 className="mb-6 text-2xl font-bold text-[#4b2e19] md:mb-8 md:text-3xl">
          Spotlight
        </h2>

        <div className="flex gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {INSTAGRAM_SPOTLIGHT_REELS.map((url, index) => (
            <div
              key={`${url}-${index}`}
              className="flex-shrink-0 [&_iframe]:!max-w-none"
            >
              <InstagramEmbed permalink={url} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

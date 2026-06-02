import type { Metadata } from "next";
import HoneyPageClient from "./HoneyPageClient";
import { getAllProductsByType } from "@/lib/strapiPublic";

export const metadata: Metadata = {
  title: "Buy Raw Multifloral Honey Online India",
  description:
    "Buy raw honey online in India — pure multifloral & forest honey, unprocessed & natural. Sweetness you can trust. Order YugaFarms honey today.",
  alternates: { canonical: "/honey" },
  openGraph: {
    title: "Buy Raw Multifloral Honey Online | YugaFarms",
    description:
      "Natural honey from Indian forests & farms. Raw, unheated honey — shop online at YugaFarms.",
  },
};

export default async function HoneyPage() {
  const products = await getAllProductsByType("Honey");
  return <HoneyPageClient products={products} />;
}

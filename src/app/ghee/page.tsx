import type { Metadata } from "next";
import GheePageClient from "./GheePageClient";
import { getAllProductsByType } from "@/lib/strapiPublic";

export const metadata: Metadata = {
  title: "A2 Sahiwal Cow Ghee – Bilona Method",
  description:
    "Buy A2 cow ghee online in India — traditional bilona-churned Sahiwal ghee, buffalo ghee & more. Pure, lab-tested. Shop the YugaFarms ghee collection.",
  alternates: { canonical: "/ghee" },
  openGraph: {
    title: "A2 Sahiwal Cow Ghee – Bilona Method | YugaFarms",
    description:
      "Traditional bilona ghee from Sahiwal cows. Buy pure A2 ghee online — India delivery from YugaFarms.",
  },
};

export default async function GheePage() {
  const products = await getAllProductsByType("Ghee");
  return <GheePageClient products={products} />;
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Customer Support & Orders",
  description:
    "Contact YugaFarms for order help, partnerships, or product questions. Email support@yugafarms.com or call +91 96713 24344. Janouli, Palwal, Haryana.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

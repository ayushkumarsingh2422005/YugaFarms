import type { Metadata } from "next";
import ProductDetailClient from "./ProductDetailClient";
import JsonLd from "@/components/seo/JsonLd";
import {
  buildBreadcrumbJsonLd,
  buildProductJsonLd,
  productMetaDescription,
} from "@/lib/seo";
import { getProductBySlug, getProductComments, getSimilarProducts } from "@/lib/strapiPublic";
import { productDetailPath } from "@/lib/productSlug";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:1337";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return { title: "Product not found", description: "This product could not be found." };
  }
  const description = productMetaDescription(product);
  const ogImage =
    product.Image?.[0]?.url != null
      ? `${BACKEND}${product.Image[0].url}`
      : undefined;
  const canonicalPath = productDetailPath(product);
  return {
    title: product.Title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: `${product.Title} | YugaFarms`,
      description,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const initialProduct = await getProductBySlug(slug);
  const similarProducts =
    initialProduct != null ? await getSimilarProducts(initialProduct) : [];
  const productComments =
    initialProduct != null ? await getProductComments(initialProduct.Type) : [];
  const path = initialProduct ? productDetailPath(initialProduct) : `/product/${slug}`;

  const breadcrumbLd =
    initialProduct != null
      ? buildBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          {
            name: initialProduct.Type,
            path: `/${initialProduct.Type.toLowerCase()}`,
          },
          { name: initialProduct.Title, path },
        ])
      : null;

  const productLd =
    initialProduct != null ? buildProductJsonLd(initialProduct, BACKEND) : null;

  return (
    <>
      {breadcrumbLd ? <JsonLd data={breadcrumbLd} /> : null}
      {productLd ? <JsonLd data={productLd} /> : null}
      <ProductDetailClient
        initialProduct={initialProduct}
        similarProducts={similarProducts}
        productComments={productComments}
      />
    </>
  );
}

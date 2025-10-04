'use client'
import React, { useEffect, useState } from "react";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND || "http://localhost:1337";

type Product = {
  id: number;
  Title: string;
  Description: string;
  Type: "Ghee" | "Honey";
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function DebugProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${BACKEND}/api/products?populate=*`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        setProducts(data.data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const testIndividualProduct = async (productId: number) => {
    try {
      const response = await fetch(`${BACKEND}/api/products/${productId}?populate=*`);
      const data = await response.json();
      console.log(`Product ${productId} individual fetch:`, data);
      alert(`Product ${productId} individual fetch: ${JSON.stringify(data, null, 2)}`);
    } catch (err) {
      console.error(`Error fetching product ${productId}:`, err);
      alert(`Error fetching product ${productId}: ${err}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Debug Products</h1>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Debug Products</h1>
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Debug Products</h1>
        <p className="mb-6">Found {products.length} products</p>
        
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold">{product.Title}</h2>
                  <p className="text-gray-600">ID: {product.id}</p>
                  <p className="text-gray-600">Type: {product.Type}</p>
                  <p className="text-gray-600">Published: {product.publishedAt ? 'Yes' : 'No'}</p>
                  <p className="text-gray-600">Created: {new Date(product.createdAt).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-500 mt-2">{product.Description}</p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => testIndividualProduct(product.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Test Individual Fetch
                  </button>
                  <a
                    href={`/product/${product.id}`}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 inline-block"
                  >
                    View Product Page
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "@/app/components/ImageUploader";
export default function NewProduct() {
  const router = useRouter();

  const [product, setProduct] = useState({
    id: "",
    name: "",
    price: "",
    sale_price: "",
    stock: "",
    description: "",
    image1: "",
    image2: "",
    image3: "",
    active: true,
  });

  const [loading, setLoading] = useState(false);

  async function createProduct() {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Product created successfully.");

      router.push("/admin/products");

    } catch (error) {

      console.error(error);
      alert("Server Error");

    } finally {

      setLoading(false);

    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">

      <div className="max-w-3xl mx-auto">

        <h1 className="text-4xl font-bold mb-10">
          Add Product
        </h1>

        <div className="space-y-6">

          <input
            placeholder="Product ID (example: noir)"
            className="w-full p-3 rounded bg-zinc-900 border border-zinc-700"
            value={product.id}
            onChange={(e) =>
              setProduct({
                ...product,
                id: e.target.value.toLowerCase(),
              })
            }
          />

          <input
            placeholder="Product Name"
            className="w-full p-3 rounded bg-zinc-900 border border-zinc-700"
            value={product.name}
            onChange={(e) =>
              setProduct({
                ...product,
                name: e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="Price"
            className="w-full p-3 rounded bg-zinc-900 border border-zinc-700"
            value={product.price}
            onChange={(e) =>
              setProduct({
                ...product,
                price: e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="Sale Price"
            className="w-full p-3 rounded bg-zinc-900 border border-zinc-700"
            value={product.sale_price}
            onChange={(e) =>
              setProduct({
                ...product,
                sale_price: e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="Stock"
            className="w-full p-3 rounded bg-zinc-900 border border-zinc-700"
            value={product.stock}
            onChange={(e) =>
              setProduct({
                ...product,
                stock: e.target.value,
              })
            }
          />

          <textarea
            placeholder="Description"
            rows={5}
            className="w-full p-3 rounded bg-zinc-900 border border-zinc-700"
            value={product.description}
            onChange={(e) =>
              setProduct({
                ...product,
                description: e.target.value,
              })
            }
          />

          <input
            placeholder="Image 1 URL"
            className="w-full p-3 rounded bg-zinc-900 border border-zinc-700"
            value={product.image1}
            onChange={(e) =>
              setProduct({
                ...product,
                image1: e.target.value,
              })
            }
          />
<ImageUploader
  label="Front Image"
  value={product.image1}
  onUpload={(path) =>
    setProduct({
      ...product,
      image1: path,
    })
  }
/>

<ImageUploader
  label="Back Image"
  value={product.image2}
  onUpload={(path) =>
    setProduct({
      ...product,
      image2: path,
    })
  }
/>

<ImageUploader
  label="Size Chart"
  value={product.image3}
  onUpload={(path) =>
    setProduct({
      ...product,
      image3: path,
    })
  }
/>
          

          <label className="flex items-center gap-3">

            <input
              type="checkbox"
              checked={product.active}
              onChange={(e) =>
                setProduct({
                  ...product,
                  active: e.target.checked,
                })
              }
            />

            Active Product

          </label>

          <button
            onClick={createProduct}
            disabled={loading}
            className="bg-white text-black px-8 py-3 rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Product"}
          </button>

        </div>

      </div>

    </main>
  );
}
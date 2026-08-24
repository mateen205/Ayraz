"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ImageUploader from "@/app/components/ImageUploader";

export default function EditProduct() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/admin/products/${id}`);
        const data = await res.json();

        setProduct({
          ...data,
          active: Boolean(data.active),
          sold_out: Boolean(data.sold_out),
          on_sale: Boolean(data.on_sale),
        });
      } catch (err) {
        console.error(err);
      }
    }

    if (id) fetchProduct();
  }, [id]);

  async function saveProduct() {
    try {
      setLoading(true);

      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      const data = await res.json();

      if (data.success) {
        alert("Product updated successfully.");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Server Error");
    } finally {
      setLoading(false);
    }
  }

  async function hideProduct() {
    if (
      !window.confirm(
        product.active
          ? "Hide this product?"
          : "Unhide this product?"
      )
    ) {
      return;
    }

    await fetch(`/api/admin/products/${id}`, {
      method: "DELETE",
    });

    router.refresh();

    setProduct({
      ...product,
      active: !product.active,
    });
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center text-3xl">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">

      <div className="max-w-5xl mx-auto">

        <div className="flex justify-between items-center mb-10">

          <div>
            <h1 className="text-5xl font-bold">
              Edit Product
            </h1>

            <p className="text-zinc-500 mt-2">
              Product ID: {product.id}
            </p>
          </div>

          <button
            onClick={() => router.push("/admin/products")}
            className="bg-zinc-800 px-6 py-3 rounded-lg hover:bg-zinc-700"
          >
            Back
          </button>

        </div>

        <div className="grid lg:grid-cols-2 gap-10">

          {/* LEFT SIDE */}

          <div className="space-y-6">

            <div>
              <label className="block mb-2 font-semibold">
                Product Name
              </label>

              <input
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-4"
                value={product.name}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    name: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold">
                Description
              </label>

              <textarea
                rows={8}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-4 resize-none"
                value={product.description || ""}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-6">

              <div>
                <label className="block mb-2 font-semibold">
                  Price
                </label>

                <input
                  type="number"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-4"
                  value={product.price}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      price: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold">
                  Sale Price
                </label>

                <input
                  type="number"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-4"
                  value={product.sale_price || ""}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      sale_price:
                        e.target.value === ""
                          ? null
                          : Number(e.target.value),
                    })
                  }
                />
              </div>

            </div>

            <div>
              <label className="block mb-2 font-semibold">
                Stock
              </label>

              <input
                type="number"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-4"
                value={product.stock}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    stock: Number(e.target.value),
                  })
                }
              />
            </div>

            <ImageUploader
              label="Front Image"
              value={product.image1 || ""}
              onUpload={(path) =>
                setProduct({
                  ...product,
                  image1: path,
                })
              }
            />

            <ImageUploader
              label="Back Image"
              value={product.image2 || ""}
              onUpload={(path) =>
                setProduct({
                  ...product,
                  image2: path,
                })
              }
            />

            <ImageUploader
              label="Size Chart"
              value={product.image3 || ""}
              onUpload={(path) =>
                setProduct({
                  ...product,
                  image3: path,
                })
              }
            />

          </div>
                    {/* RIGHT SIDE */}

          <div className="bg-zinc-900 rounded-2xl p-8 h-fit">

            <h2 className="text-2xl font-bold mb-8">
              Product Settings
            </h2>

            <div className="space-y-6">

              <label className="flex justify-between items-center">
                <span>Active Product</span>

                <input
                  type="checkbox"
                  checked={product.active}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      active: e.target.checked,
                    })
                  }
                  className="w-5 h-5"
                />
              </label>

              <label className="flex justify-between items-center">
                <span>Sold Out</span>

                <input
                  type="checkbox"
                  checked={product.sold_out}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      sold_out: e.target.checked,
                    })
                  }
                  className="w-5 h-5"
                />
              </label>

              <label className="flex justify-between items-center">
                <span>On Sale</span>

                <input
                  type="checkbox"
                  checked={product.on_sale}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      on_sale: e.target.checked,
                    })
                  }
                  className="w-5 h-5"
                />
              </label>

              <hr className="border-zinc-700" />

              <button
                disabled={loading}
                onClick={saveProduct}
                className="w-full bg-white text-black py-4 rounded-xl font-semibold hover:bg-zinc-200 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>

              <button
                onClick={hideProduct}
                className={`w-full py-4 rounded-xl font-semibold ${
                  product.active
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {product.active
                  ? "Hide Product"
                  : "Unhide Product"}
              </button>

            </div>

          </div>
                  </div>

      </div>

    </main>
  );
}
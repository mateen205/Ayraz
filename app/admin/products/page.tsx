"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  async function loadProducts() {
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function toggleProduct(product: any) {
    const action = product.active ? "hide" : "unhide";

    if (
      !window.confirm(
        `Are you sure you want to ${action} "${product.name}"?`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      loadProducts();
    } catch (error) {
      console.error(error);
      alert("Server Error");
    }
  }

  const filteredProducts = useMemo(() => {
    let data = [...products];

    if (search.trim()) {
      data = data.filter(
        (product) =>
          product.name
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          product.id
            .toLowerCase()
            .includes(search.toLowerCase())
      );
    }

    switch (filter) {
      case "active":
        data = data.filter(
          (p) => p.active && p.stock > 0
        );
        break;

      case "low":
        data = data.filter(
          (p) => p.active && p.stock > 0 && p.stock <= 5
        );
        break;

      case "sold":
        data = data.filter(
          (p) => p.active && p.stock === 0
        );
        break;

      case "hidden":
        data = data.filter((p) => !p.active);
        break;
    }

    return data;
  }, [products, search, filter]);

  return (
    <main className="min-h-screen bg-black text-white p-10">

      <div className="flex items-center justify-between mb-10">

        <div>

          <h1 className="text-4xl font-bold">
            Products
          </h1>

          <p className="text-zinc-500 mt-2">
            {filteredProducts.length} Products
          </p>

        </div>

        <Link
          href="/admin/products/new"
          className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-zinc-200 transition"
        >
          + Add Product
        </Link>

      </div>

      {/* Search */}

      <div className="mb-6">

        <input
          type="text"
          placeholder="Search by product name or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-5 py-4 outline-none"
        />

      </div>

      {/* Filters */}

      <div className="flex flex-wrap gap-3 mb-8">

        {[
          ["all", "All"],
          ["active", "Active"],
          ["low", "Low Stock"],
          ["sold", "Sold Out"],
          ["hidden", "Hidden"],
        ].map(([value, label]) => (

          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`px-5 py-2 rounded-full transition ${
              filter === value
                ? "bg-white text-black"
                : "bg-zinc-900 hover:bg-zinc-800"
            }`}
          >
            {label}
          </button>

        ))}

      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-800">

        <table className="w-full">

          <thead className="bg-zinc-900">

            <tr>

              <th className="p-4 text-left">Image</th>

              <th className="p-4 text-left">Name</th>

              <th className="p-4 text-left">Price</th>

              <th className="p-4 text-left">Sale</th>

              <th className="p-4 text-left">Stock</th>

              <th className="p-4 text-left">Status</th>

              <th className="p-4 text-left">Actions</th>

            </tr>

          </thead>

          <tbody>

            {filteredProducts.map((product) => (

              <tr
                key={product.id}
                className="border-t border-zinc-800 hover:bg-zinc-900 transition"
              >

                <td className="p-4">

                  <img
                    src={product.image1}
                    alt={product.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />

                </td>

                <td className="p-4 font-semibold">

                  {product.name}

                  <div className="text-zinc-500 text-sm mt-1">
                    {product.id}
                  </div>

                </td>

                <td className="p-4">
                  PKR {Number(product.price).toLocaleString()}
                </td>

                <td className="p-4">

                  {product.on_sale ? (
                    <span className="bg-white text-black px-3 py-1 rounded-full text-sm font-semibold">
                      PKR {Number(product.sale_price).toLocaleString()}
                    </span>
                  ) : (
                    "-"
                  )}

                </td>

                <td className="p-4">
                  {product.stock}
                </td>

                <td className="p-4">

                  {!product.active ? (
                    <span className="text-red-400 font-medium">
                      Hidden
                    </span>
                  ) : product.stock === 0 ? (
                    <span className="text-yellow-400 font-medium">
                      Sold Out
                    </span>
                  ) : product.stock <= 5 ? (
                    <span className="text-orange-400 font-medium">
                      Low Stock
                    </span>
                  ) : (
                    <span className="text-green-400 font-medium">
                      Active
                    </span>
                  )}

                </td>

                <td className="p-4">

                  <div className="flex gap-5">

                    <Link
                      href={`/admin/products/${product.id}`}
                      className="text-blue-400 hover:underline"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => toggleProduct(product)}
                      className={`hover:underline ${
                        product.active
                          ? "text-red-400"
                          : "text-green-400"
                      }`}
                    >
                      {product.active ? "Hide" : "Unhide"}
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </main>
  );
}
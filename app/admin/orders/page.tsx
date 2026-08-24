"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  async function loadOrders() {
    try {
      const res = await fetch("/api/admin/orders", {
        cache: "no-store",
      });

      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    let data = [...orders];

    if (search.trim()) {
      data = data.filter(
        (order) =>
          order.customer_name
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          order.phone.includes(search) ||
          order.id.toString().includes(search)
      );
    }

    if (filter !== "All") {
      data = data.filter(
        (order) => order.status === filter
      );
    }

    return data;
  }, [orders, search, filter]);

  function badge(status: string) {
    switch (status) {
      case "Pending":
        return "bg-yellow-500 text-black";
      case "Confirmed":
        return "bg-blue-500";
      case "Shipped":
        return "bg-purple-500";
      case "Delivered":
        return "bg-green-600";
      case "Cancelled":
        return "bg-red-600";
      default:
        return "bg-zinc-700";
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">

      <div className="flex justify-between items-center mb-10">

        <div>
          <h1 className="text-5xl font-bold">
            Orders
          </h1>

          <p className="text-zinc-500 mt-2">
            {filteredOrders.length} Orders
          </p>
        </div>

      </div>

      <input
        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-4 mb-6 outline-none"
        placeholder="Search by Customer, Phone or Order ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="flex gap-3 flex-wrap mb-8">

        {[
          "All",
          "Pending",
          "Confirmed",
          "Shipped",
          "Delivered",
          "Cancelled",
        ].map((item) => (

          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`px-5 py-2 rounded-full transition ${
              filter === item
                ? "bg-white text-black"
                : "bg-zinc-900"
            }`}
          >
            {item}
          </button>

        ))}

      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-800">

        <table className="w-full">

          <thead className="bg-zinc-900">

            <tr>

              <th className="text-left p-4">
                Order
              </th>

              <th className="text-left p-4">
                Customer
              </th>

              <th className="text-left p-4">
                Phone
              </th>

              <th className="text-left p-4">
                Total
              </th>

              <th className="text-left p-4">
                Status
              </th>

              <th className="text-left p-4">
                Date
              </th>

              <th className="text-left p-4">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredOrders.map((order) => (

              <tr
                key={order.id}
                className="border-t border-zinc-800 hover:bg-zinc-900"
              >

                <td className="p-4">
                  #{order.id}
                </td>

                <td className="p-4">
                  {order.customer_name}
                </td>

                <td className="p-4">
                  {order.phone}
                </td>

                <td className="p-4">
                  PKR {Number(order.total).toLocaleString()}
                </td>

                <td className="p-4">

                  <span
                    className={`px-3 py-1 rounded-full text-sm ${badge(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>

                </td>

                <td className="p-4">
                  {new Date(
                    order.created_at
                  ).toLocaleDateString()}
                </td>

                <td className="p-4">

                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-blue-400 hover:underline"
                  >
                    View
                  </Link>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </main>
  );
}
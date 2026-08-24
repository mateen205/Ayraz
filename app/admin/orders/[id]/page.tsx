"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function OrderDetailsPage() {
  const { id } = useParams();

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/admin/orders/${id}`);
      const json = await res.json();
      setData(json);
    }

    if (id) load();
  }, [id]);

  async function updateStatus(status: string) {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    setData({
      ...data,
      order: {
        ...data.order,
        status,
      },
    });
  }

  if (!data) {
    return (
      <main className="p-10 text-white">
        Loading...
      </main>
    );
  }

  const { order, items } = data;

  return (
    <main className="min-h-screen bg-black text-white p-10">

      <h1 className="text-5xl font-bold mb-10">
        Order #{order.id}
      </h1>

      <div className="grid lg:grid-cols-2 gap-10">

        <div className="bg-zinc-900 rounded-xl p-8">

          <h2 className="text-2xl font-bold mb-6">
            Customer
          </h2>

          <div className="space-y-3">

            <p><b>Name:</b> {order.customer_name}</p>

            <p><b>Phone:</b> {order.phone}</p>

            <p><b>Email:</b> {order.email || "-"}</p>

            <p><b>City:</b> {order.city}</p>

            <p><b>Address:</b></p>

            <p className="text-zinc-400">
              {order.address}
            </p>

          </div>

        </div>

        <div className="bg-zinc-900 rounded-xl p-8">

          <h2 className="text-2xl font-bold mb-6">
            Order Details
          </h2>

          <div className="space-y-4">

            <p>
              <b>Total:</b> PKR{" "}
              {Number(order.total).toLocaleString()}
            </p>

            <p>
              <b>Payment:</b> {order.payment_method}
            </p>

            <p>
              <b>Status:</b>
            </p>

            <select
              value={order.status}
              onChange={(e) =>
                updateStatus(e.target.value)
              }
              className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 w-full"
            >
              <option>Pending</option>
              <option>Confirmed</option>
              <option>Shipped</option>
              <option>Delivered</option>
              <option>Cancelled</option>
            </select>

          </div>

        </div>

      </div>

      <div className="mt-10 bg-zinc-900 rounded-xl p-8">

        <h2 className="text-2xl font-bold mb-8">
          Products
        </h2>

        <div className="space-y-6">

          {items.map((item: any) => (
            <div
              key={item.id}
              className="flex justify-between items-center border-b border-zinc-800 pb-6"
            >

              <div className="flex gap-5 items-center">
console.log(item.image);
                <img
                  src={item.image}
                  className="w-24 h-24 rounded-lg object-cover"
                />

                <div>

                  <h3 className="text-xl font-semibold">
                    {item.product_name}
                  </h3>

                  <p>Size: {item.size}</p>

                  <p>Qty: {item.quantity}</p>

                </div>

              </div>

              <div className="font-bold text-xl">
                PKR {Number(item.price).toLocaleString()}
              </div>

            </div>
          ))}

        </div>

      </div>

    </main>
  );
}
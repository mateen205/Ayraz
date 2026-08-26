"use client";

import { useEffect, useState } from "react";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/analytics");
      const json = await res.json();
      console.log("ANALYTICS DATA:", json);
      setData(json);
    }

    load();
  }, []);

  if (!data) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading Analytics...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">

      <h1 className="text-5xl font-bold mb-10">
        Analytics
      </h1>

      {/* Revenue */}

      <section className="mb-12">

        <h2 className="text-3xl font-bold mb-5">
          Monthly Revenue
        </h2>

        <div className="bg-zinc-900 rounded-xl p-6">

          {data.revenue.length === 0 ? (
            <p>No Revenue Yet</p>
          ) : (
            data.revenue.map((item: any) => (
              <div
                key={item.month}
                className="flex justify-between border-b border-zinc-800 py-3"
              >
                <span>{item.month}</span>

                <span>
                  PKR {Number(item.revenue).toLocaleString()}
                </span>

              </div>
            ))
          )}

        </div>

      </section>

      {/* Top Products */}

      <section className="mb-12">

        <h2 className="text-3xl font-bold mb-5">
          Top Selling Products
        </h2>

        <div className="bg-zinc-900 rounded-xl p-6">

          {data.topProducts.length === 0 ? (
            <p>No Sales Yet</p>
          ) : (
            data.topProducts.map((product: any, index: number) => (

              <div
                key={index}
                className="flex justify-between border-b border-zinc-800 py-3"
              >
                <span>{product.product_name}</span>

                <span>{product.sold} Sold</span>

              </div>

            ))
          )}

        </div>

      </section>

      {/* Latest Orders */}

      <section className="mb-12">

        <h2 className="text-3xl font-bold mb-5">
          Latest Orders
        </h2>

        <div className="bg-zinc-900 rounded-xl p-6">

          {data.latestOrders.length === 0 ? (
            <p>No Orders</p>
          ) : (
            data.latestOrders.map((order: any) => (

              <div
                key={order.id}
                className="flex justify-between border-b border-zinc-800 py-3"
              >

                <span>
                  #{order.id} - {order.customer_name}
                </span>

                <span>
                  PKR {Number(order.total).toLocaleString()}
                </span>

              </div>

            ))
          )}

        </div>

      </section>

      {/* Low Stock */}

      <section>

        <h2 className="text-3xl font-bold mb-5 text-red-500">
          Low Stock Products
        </h2>

        <div className="bg-zinc-900 rounded-xl p-6">

          {data.lowStock.length === 0 ? (
            <p>All Products Well Stocked</p>
          ) : (
            data.lowStock.map((item: any) => (

              <div
                key={item.id}
                className="flex justify-between border-b border-zinc-800 py-3"
              >

                <span>{item.name}</span>

                <span>{item.stock} Left</span>

              </div>

            ))
          )}

        </div>

      </section>

    </main>
  );
}
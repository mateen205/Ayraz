"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type DashboardStats = {
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  productsSold: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    productsSold: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await fetch("/api/admin/dashboard", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to load dashboard");
        }

        const data = await res.json();

        setStats({
          totalOrders: Number(data.totalOrders) || 0,
          pendingOrders: Number(data.pendingOrders) || 0,
          totalRevenue: Number(data.totalRevenue) || 0,
          productsSold: Number(data.productsSold) || 0,
        });
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();

    const interval = setInterval(loadDashboard, 5000);

    return () => clearInterval(interval);
  }, []);

  const revenue = Number(stats.totalRevenue).toLocaleString();

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HEADER */}
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-zinc-600">
            AYRAZ ADMINISTRATION
          </p>

          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Dashboard
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-500">
            Overview of your store performance, orders and sales.
          </p>
        </div>

        <Link
          href="/admin/orders"
          className="inline-flex w-fit items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
        >
          Manage Orders
          <span className="ml-3">→</span>
        </Link>

      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* TOTAL ORDERS */}
        <div className="group rounded-2xl border border-zinc-900 bg-zinc-950 p-6 transition hover:border-zinc-700">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">
                Total Orders
              </p>

              <h2 className="mt-5 text-4xl font-semibold tracking-tight">
                {loading ? "—" : stats.totalOrders}
              </h2>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 text-sm text-zinc-400">
              #
            </div>

          </div>

          <p className="mt-6 text-xs text-zinc-600">
            All orders placed
          </p>

        </div>

        {/* PENDING ORDERS */}
        <div className="group rounded-2xl border border-zinc-900 bg-zinc-950 p-6 transition hover:border-zinc-700">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">
                Pending Orders
              </p>

              <h2 className="mt-5 text-4xl font-semibold tracking-tight">
                {loading ? "—" : stats.pendingOrders}
              </h2>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 text-sm text-zinc-400">
              !
            </div>

          </div>

          <p className="mt-6 text-xs text-zinc-600">
            Orders requiring attention
          </p>

        </div>

        {/* REVENUE */}
        <div className="rounded-2xl border border-zinc-800 bg-white p-6 text-black transition hover:border-white">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                Total Revenue
              </p>

              <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
                PKR
              </h2>

              <p className="mt-1 text-2xl font-medium tracking-tight sm:text-3xl">
                {loading ? "—" : revenue}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-sm">
              ₨
            </div>

          </div>

          <p className="mt-6 text-xs text-zinc-500">
            Store revenue generated
          </p>

        </div>

        {/* PRODUCTS SOLD */}
        <div className="group rounded-2xl border border-zinc-900 bg-zinc-950 p-6 transition hover:border-zinc-700">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">
                Products Sold
              </p>

              <h2 className="mt-5 text-4xl font-semibold tracking-tight">
                {loading ? "—" : stats.productsSold}
              </h2>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 text-sm text-zinc-400">
              ×
            </div>

          </div>

          <p className="mt-6 text-xs text-zinc-600">
            Total units sold
          </p>

        </div>

      </div>

      {/* QUICK ACTIONS */}
      <section className="mt-10">

        <div className="mb-5">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-600">
            Quick Actions
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            Manage Store
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

          <Link
            href="/admin/orders"
            className="group rounded-2xl border border-zinc-900 bg-zinc-950 p-6 transition hover:border-zinc-600"
          >
            <div className="flex items-center justify-between">

              <div>
                <p className="text-lg font-medium">
                  Orders
                </p>

                <p className="mt-2 text-sm text-zinc-600">
                  View and manage customer orders
                </p>
              </div>

              <span className="text-xl text-zinc-600 transition group-hover:translate-x-1 group-hover:text-white">
                →
              </span>

            </div>
          </Link>

          <Link
            href="/admin/products"
            className="group rounded-2xl border border-zinc-900 bg-zinc-950 p-6 transition hover:border-zinc-600"
          >
            <div className="flex items-center justify-between">

              <div>
                <p className="text-lg font-medium">
                  Products
                </p>

                <p className="mt-2 text-sm text-zinc-600">
                  Manage products, prices and stock
                </p>
              </div>

              <span className="text-xl text-zinc-600 transition group-hover:translate-x-1 group-hover:text-white">
                →
              </span>

            </div>
          </Link>

          <Link
            href="/admin/users"
            className="group rounded-2xl border border-zinc-900 bg-zinc-950 p-6 transition hover:border-zinc-600"
          >
            <div className="flex items-center justify-between">

              <div>
                <p className="text-lg font-medium">
                  Customers
                </p>

                <p className="mt-2 text-sm text-zinc-600">
                  View registered customers
                </p>
              </div>

              <span className="text-xl text-zinc-600 transition group-hover:translate-x-1 group-hover:text-white">
                →
              </span>

            </div>
          </Link>

        </div>

      </section>

      {/* STORE STATUS */}
      <section className="mt-10 rounded-2xl border border-zinc-900 bg-zinc-950 p-6">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-600">
              Store Status
            </p>

            <h2 className="mt-2 text-xl font-medium">
              AYRAZ Store
            </h2>

            <p className="mt-2 text-sm text-zinc-600">
              Dashboard automatically refreshes every 5 seconds.
            </p>
          </div>

          <div className="flex items-center gap-3">

            <span className="h-2.5 w-2.5 rounded-full bg-green-500" />

            <span className="text-sm text-zinc-400">
              Online
            </span>

          </div>

        </div>

      </section>

    </main>
  );
}
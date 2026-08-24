"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Login page gets NO admin sidebar
  if (pathname === "/admin/login") {
    return (
      <main className="min-h-screen bg-black text-white">
        {children}
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex">

      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-zinc-950 border-r border-zinc-800 p-6 min-h-screen">

        <h1 className="text-2xl font-bold tracking-widest mb-10">
          AYRAZ ADMIN
        </h1>

        <nav className="flex flex-col gap-5">

          <Link
            href="/admin"
            className="hover:text-zinc-300 transition"
          >
            🏠 Dashboard
          </Link>

          <Link
            href="/admin/orders"
            className="hover:text-zinc-300 transition"
          >
            📦 Orders
          </Link>
<Link
  href="/admin/users"
  className="hover:text-zinc-300"
>
  👤 Users
</Link>
          <Link
            href="/admin/products"
            className="hover:text-zinc-300 transition"
          >
            👕 Products
          </Link>

          <Link
            href="/admin/analytics"
            className="hover:text-zinc-300 transition"
          >
            📈 Analytics
          </Link>

        </nav>

      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 p-10 overflow-auto">
        {children}
      </main>

    </div>
  );
}
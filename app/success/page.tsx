"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">

      <div className="text-center max-w-xl">

        <CheckCircle
          size={90}
          className="mx-auto text-green-500"
        />

        <h1 className="text-5xl font-bold mt-8">
          Order Placed!
        </h1>

        <p className="text-zinc-400 mt-6 text-lg leading-8">
          Thank you for shopping with AYRAZ.
          Your order has been received and will be processed shortly.
        </p>

        <Link
          href="/"
          className="inline-block mt-10 bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-zinc-200 transition"
        >
          Continue Shopping
        </Link>

      </div>

    </main>
  );
}
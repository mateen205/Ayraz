"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
  if (data.needsVerification && data.email) {
    router.push(
      `/verify-email?email=${encodeURIComponent(data.email)}`
    );
    return;
  }

  setError(data.message || "Invalid email or password.");
  return;
}
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex">

      {/* LEFT */}
      <div className="hidden lg:flex w-1/2 items-center justify-center border-r border-white/10 bg-gradient-to-br from-black via-zinc-950 to-black">
        <div className="max-w-lg px-16">

          <p className="uppercase tracking-[0.4em] text-zinc-500 text-sm">
            AYRAZ
          </p>

          <h1 className="mt-8 text-6xl font-bold leading-none">
            ADMIN
            <br />
            ACCESS.
          </h1>

          <p className="mt-8 text-zinc-400 leading-8 text-lg">
            Secure access to the AYRAZ administration panel.
          </p>

        </div>
      </div>

      {/* RIGHT */}
      <div className="flex flex-1 items-center justify-center px-8 py-16">

        <div className="w-full max-w-md">

          <div className="mb-12 text-center">

            <h2 className="text-4xl font-semibold tracking-[0.35em]">
              AYRAZ
            </h2>

            <p className="mt-5 text-zinc-500 uppercase tracking-[0.25em] text-sm">
              Admin Login
            </p>

          </div>

          <form onSubmit={handleLogin} className="space-y-7">

            {/* EMAIL */}
            <div>
              <label className="mb-3 block text-xs font-medium uppercase tracking-[0.25em] text-zinc-500">
                Admin Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="admin@example.com"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-5 py-4 text-white placeholder:text-zinc-600 outline-none transition focus:border-zinc-500 focus:bg-zinc-900"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="mb-3 block text-xs font-medium uppercase tracking-[0.25em] text-zinc-500">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-5 py-4 text-white placeholder:text-zinc-600 outline-none transition focus:border-zinc-500 focus:bg-zinc-900"
              />
            </div>

            {/* ERROR */}
            {error && (
              <div className="rounded-xl border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="mt-4 w-full rounded-full bg-white py-4 text-black font-semibold tracking-[0.2em] uppercase transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Logging In..." : "Admin Login"}
            </button>

          </form>

          <div className="mt-10 text-center">

            <a
              href="/"
              className="text-sm text-zinc-500 transition hover:text-white"
            >
              ← Return to Store
            </a>

          </div>

        </div>

      </div>

    </main>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
  setError(data.message || "Invalid email or password.");
  return;
}

      router.push("/");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">

      <div className="mx-auto min-h-screen max-w-7xl">

        <div className="flex min-h-screen">

          {/* LEFT - DESKTOP */}
          <div className="hidden lg:flex lg:w-1/2 items-center border-r border-zinc-900 px-16">

            <div className="max-w-lg">

              <p className="text-sm uppercase tracking-[0.45em] text-zinc-600">
                AYRAZ
              </p>

              <h1 className="mt-8 text-7xl font-bold leading-[0.9]">
                WELCOME
                <br />
                BACK.
              </h1>

              <p className="mt-8 max-w-md text-lg leading-8 text-zinc-500">
                Sign in to manage your orders, track deliveries,
                and experience premium Pakistani streetwear.
              </p>

            </div>

          </div>

          {/* RIGHT */}
          <div className="flex w-full lg:w-1/2 items-start lg:items-center justify-center px-6 py-8 sm:px-10">

            <div className="w-full max-w-md">

              {/* MOBILE HEADER */}
              <div className="mb-10 flex items-center lg:hidden">

                <Link
                  href="/"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-800 text-2xl text-zinc-300 transition hover:border-zinc-600 hover:text-white"
                >
                  ←
                </Link>

                <h1 className="flex-1 text-center text-2xl font-semibold tracking-[0.2em]">
                  LOGIN
                </h1>

                <div className="w-11" />

              </div>

              {/* DESKTOP HEADER */}
              <div className="mb-12 hidden text-center lg:block">

                <h2 className="text-4xl font-semibold tracking-[0.35em]">
                  AYRAZ
                </h2>

                <p className="mt-4 text-sm uppercase tracking-[0.3em] text-zinc-600">
                  Customer Login
                </p>

              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >

                {/* EMAIL */}
                <div>

                  <label className="mb-2 block text-sm font-medium text-zinc-400">
                    Email
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={`w-full rounded-xl border bg-zinc-950 px-4 py-4 text-white placeholder:text-zinc-700 outline-none transition ${
                      error
                        ? "border-red-500 focus:border-red-500"
                        : "border-zinc-800 focus:border-zinc-400"
                    }`}
                  />

                </div>

                {/* PASSWORD */}
                <div>

                  <label className="mb-2 block text-sm font-medium text-zinc-400">
                    Password
                  </label>

                  <div className="relative">

                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError("");
                      }}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className={`w-full rounded-xl border bg-zinc-950 px-4 py-4 pr-14 text-white placeholder:text-zinc-700 outline-none transition ${
                        error
                          ? "border-red-500 focus:border-red-500"
                          : "border-zinc-800 focus:border-zinc-400"
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-zinc-600 hover:text-white"
                    >
                      {showPassword ? "◉" : "◌"}
                    </button>

                  </div>

                </div>

                {/* ERROR */}
                {error && (
                  <div className="rounded-xl border border-red-900 bg-red-950/30 px-4 py-3">

                    <p className="text-sm font-medium text-red-500">
                      {error}
                    </p>

                  </div>
                )}

                {/* FORGOT PASSWORD */}
                <div className="flex justify-end">

                  <Link
                    href="/forgot-password"
                    className="text-sm text-zinc-500 transition hover:text-white"
                  >
                    Forgot Password?
                  </Link>

                </div>

                {/* LOGIN BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full rounded-full py-4 font-semibold uppercase tracking-[0.2em] transition ${
                    loading
                      ? "cursor-not-allowed bg-zinc-800 text-zinc-600"
                      : "bg-white text-black hover:bg-zinc-200"
                  }`}
                >
                  {loading ? "Signing In..." : "Login"}
                </button>

              </form>

              {/* SIGNUP */}
              <div className="mt-10 text-center">

                <p className="text-zinc-500">
                  New to AYRAZ?
                </p>

                <Link
                  href="/signup"
                  className="mt-2 inline-block font-medium text-white underline-offset-4 hover:underline"
                >
                  Create Account
                </Link>

              </div>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}
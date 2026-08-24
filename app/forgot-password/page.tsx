"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Something went wrong.");
      } else {
        setMessage(
          "If an account exists with this email, you will receive a password reset link."
        );
      }
    } catch {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-md">

        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-[0.4em] text-zinc-500">
            AYRAZ
          </p>

          <h1 className="mt-6 text-4xl font-semibold tracking-[0.15em]">
            RESET PASSWORD
          </h1>

          <p className="mt-5 text-sm leading-7 text-zinc-500">
            Enter the email associated with your account and we'll
            send you a secure password reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-7">

          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Email
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={`mt-2 w-full border-b bg-transparent py-4 outline-none transition ${
                error
                  ? "border-red-500 focus:border-red-500"
                  : "border-zinc-700 focus:border-white"
              }`}
            />

            {error && (
              <p className="mt-2 text-sm text-red-500">
                {error}
              </p>
            )}
          </div>

          {message && (
            <p className="text-sm leading-6 text-zinc-300">
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-white py-4 text-black font-semibold uppercase tracking-[0.2em] transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

        </form>

        <div className="mt-10 text-center">
          <Link
            href="/login"
            className="text-sm uppercase tracking-[0.2em] text-zinc-500 transition hover:text-white"
          >
            ← Back to Login
          </Link>
        </div>

      </div>
    </main>
  );
}
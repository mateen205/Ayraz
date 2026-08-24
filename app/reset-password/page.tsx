"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!token) {
      setError("This password reset link is invalid.");
      return;
    }

    if (password.length < 8 || password.length > 72) {
      setError(
        "Password must be 8-72 characters and contain uppercase, lowercase, and a number."
      );
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter.");
      return;
    }

    if (!/[a-z]/.test(password)) {
      setError("Password must contain at least one lowercase letter.");
      return;
    }

    if (!/[0-9]/.test(password)) {
      setError("Password must contain at least one number.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Unable to reset password.");
        return;
      }

      setSuccess("Password reset successfully.");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-red-500">
          This password reset link is invalid or incomplete.
        </p>

        <Link
          href="/forgot-password"
          className="mt-8 inline-block text-sm uppercase tracking-[0.2em] text-zinc-500 transition hover:text-white"
        >
          Request a New Link
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <div>
        <label
          htmlFor="new-password"
          className="text-xs uppercase tracking-[0.2em] text-zinc-500"
        >
          New Password
        </label>

        <input
          id="new-password"
          name="new-password"
          type="password"
          required
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className={`mt-2 w-full border-b bg-transparent py-4 outline-none transition ${
            error
              ? "border-red-500 focus:border-red-500"
              : "border-zinc-700 focus:border-white"
          }`}
        />
      </div>

      <div>
        <label
          htmlFor="confirm-password"
          className="text-xs uppercase tracking-[0.2em] text-zinc-500"
        >
          Confirm Password
        </label>

        <input
          id="confirm-password"
          name="confirm-password"
          type="password"
          required
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          className={`mt-2 w-full border-b bg-transparent py-4 outline-none transition ${
            error
              ? "border-red-500 focus:border-red-500"
              : "border-zinc-700 focus:border-white"
          }`}
        />
      </div>

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}

      {success && (
        <p className="text-sm text-green-400">
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-white py-4 font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
}

function LoadingState() {
  return (
    <div className="text-center text-sm text-zinc-500">
      Loading reset page...
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="w-full max-w-md">
        <div className="mb-12 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-zinc-500">
            AYRAZ
          </p>

          <h1 className="mt-6 text-4xl font-semibold tracking-[0.15em]">
            NEW PASSWORD
          </h1>

          <p className="mt-5 text-sm leading-7 text-zinc-500">
            Create a new password for your AYRAZ account.
          </p>
        </div>

        <Suspense fallback={<LoadingState />}>
          <ResetPasswordForm />
        </Suspense>

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
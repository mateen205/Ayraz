"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const email = searchParams.get("email") || "";

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  async function handleVerify(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setResendMessage("");

    if (!email) {
      setError("Verification email is missing.");
      return;
    }

    if (!/^\d{6}$/.test(code)) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(
          data.message || "Invalid or expired verification code."
        );
        return;
      }

      router.push("/login");
    } catch (error) {
      console.error(error);

      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError("");
    setResendMessage("");

    if (!email) {
      setError("Verification email is missing.");
      return;
    }

    try {
      setResending(true);

      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(
          data.message || "Unable to resend verification code."
        );
        return;
      }

      setCode("");

      setResendMessage(
        "A new verification code has been sent to your email."
      );
    } catch (error) {
      console.error(error);

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setResending(false);
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
            VERIFY
            <br />
            YOUR EMAIL.
          </h1>

          <p className="mt-8 text-zinc-400 leading-8 text-lg">
            One final step. Verify your email address
            to activate your AYRAZ account.
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex flex-1 items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-semibold tracking-[0.35em]">
              VERIFY
            </h2>

            <p className="mt-5 text-zinc-500 text-sm leading-6">
              We sent a 6-digit verification code to
            </p>

            <p className="mt-1 text-white font-medium break-all">
              {email || "your email"}
            </p>
          </div>

          <form
            onSubmit={handleVerify}
            className="space-y-7"
            noValidate
          >
            {/* CODE */}
            <div>
              <label className="mb-3 block text-xs font-medium uppercase tracking-[0.25em] text-zinc-500">
                Verification Code
              </label>

              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={code}
                onChange={(e) => {
                  const value = e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 6);

                  setCode(value);
                  setError("");
                  setResendMessage("");
                }}
                placeholder="000000"
                className={`w-full rounded-xl border bg-zinc-900/60 px-5 py-5 text-center text-2xl tracking-[0.5em] text-white placeholder:text-zinc-700 outline-none transition ${
                  error
                    ? "border-red-500"
                    : "border-zinc-800 focus:border-zinc-500"
                }`}
              />

              {error && (
                <p className="mt-3 text-sm text-red-500">
                  {error}
                </p>
              )}

              {resendMessage && (
                <p className="mt-3 text-sm text-green-400">
                  {resendMessage}
                </p>
              )}
            </div>

            {/* VERIFY BUTTON */}
            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full rounded-full bg-white py-4 text-black font-semibold uppercase tracking-[0.2em] transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify Email"}
            </button>
          </form>

          {/* RESEND */}
          <div className="mt-8 text-center">
            <p className="text-sm text-zinc-600">
              Didn't receive the code or has it expired?
            </p>

            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="mt-3 text-sm uppercase tracking-[0.2em] text-zinc-400 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {resending
                ? "Sending..."
                : "Resend Verification Code"}
            </button>
          </div>

          <div className="mt-10 text-center">
            <p className="text-sm text-zinc-600">
              Your verification code expires in 10 minutes.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
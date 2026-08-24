"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordRules = {
    length: form.password.length >= 8,
    uppercase: /[A-Z]/.test(form.password),
    lowercase: /[a-z]/.test(form.password),
    number: /[0-9]/.test(form.password),
    special: /[^A-Za-z0-9]/.test(form.password),
  };

  const passwordValid =
    passwordRules.length &&
    passwordRules.uppercase &&
    passwordRules.lowercase &&
    passwordRules.number &&
    passwordRules.special;

  const emailValid =
    form.email === "" ||
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

  const passwordsMatch =
    form.confirmPassword === "" ||
    form.password === form.confirmPassword;

  const formValid =
    form.name.trim().length >= 2 &&
    emailValid &&
    passwordValid &&
    form.confirmPassword !== "" &&
    passwordsMatch;

  function updateField(
    field: keyof typeof form,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formValid) {
      setError("Please complete all fields correctly.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Unable to create account.");
        return;
      }
router.push(
  `/verify-email?email=${encodeURIComponent(
    form.email.trim().toLowerCase()
  )}`
);
      
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function Rule({
    valid,
    children,
  }: {
    valid: boolean;
    children: React.ReactNode;
  }) {
    return (
      <div
        className={`flex items-center gap-2 text-sm ${
          valid ? "text-green-500" : "text-red-500"
        }`}
      >
        <span className="text-base">
          {valid ? "✓" : "×"}
        </span>

        <span>{children}</span>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">

      {/* MOBILE / DESKTOP CONTAINER */}
      <div className="mx-auto min-h-screen max-w-7xl">

        <div className="flex min-h-screen">

          {/* LEFT SIDE - DESKTOP ONLY */}
          <div className="hidden lg:flex lg:w-1/2 items-center border-r border-zinc-900 px-16">
            <div className="max-w-lg">

              <p className="text-sm uppercase tracking-[0.45em] text-zinc-600">
                AYRAZ
              </p>

              <h1 className="mt-8 text-7xl font-bold leading-[0.9]">
                JOIN
                <br />
                AYRAZ.
              </h1>

              <p className="mt-8 max-w-md text-lg leading-8 text-zinc-500">
                Create your account to track orders,
                save your details and experience
                premium Pakistani streetwear.
              </p>

            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex w-full lg:w-1/2 items-start lg:items-center justify-center px-6 py-8 sm:px-10">

            <div className="w-full max-w-md">

              {/* MOBILE HEADER */}
              <div className="mb-10 flex items-center lg:hidden">

                <Link
                  href="/login"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-800 text-2xl text-zinc-300 transition hover:border-zinc-600 hover:text-white"
                >
                  ←
                </Link>

                <h1 className="flex-1 text-center text-2xl font-semibold tracking-[0.2em]">
                  SIGN UP
                </h1>

                <div className="w-11" />

              </div>

              {/* DESKTOP HEADER */}
              <div className="mb-12 hidden text-center lg:block">

                <h2 className="text-4xl font-semibold tracking-[0.35em]">
                  AYRAZ
                </h2>

                <p className="mt-4 text-sm uppercase tracking-[0.3em] text-zinc-600">
                  Create Account
                </p>

              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >

                {/* NAME */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-400">
                    Full Name
                  </label>

                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      updateField("name", e.target.value)
                    }
                    placeholder="Your full name"
                    autoComplete="name"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-4 text-white placeholder:text-zinc-700 outline-none transition focus:border-zinc-400"
                  />
                </div>

                {/* EMAIL */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-400">
                    Email
                  </label>

                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      updateField("email", e.target.value)
                    }
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={`w-full rounded-xl border bg-zinc-950 px-4 py-4 text-white placeholder:text-zinc-700 outline-none transition ${
                      !emailValid
                        ? "border-red-500"
                        : "border-zinc-800 focus:border-zinc-400"
                    }`}
                  />

                  {!emailValid && (
                    <p className="mt-2 text-sm text-red-500">
                      Enter a valid email address.
                    </p>
                  )}
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-400">
                    Password
                  </label>

                  <div className="relative">

                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) =>
                        updateField("password", e.target.value)
                      }
                      placeholder="Create a strong password"
                      autoComplete="new-password"
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-4 pr-14 text-white placeholder:text-zinc-700 outline-none transition focus:border-zinc-400"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-zinc-600 hover:text-white"
                    >
                      {showPassword ? "◉" : "◌"}
                    </button>

                  </div>

                  {/* PASSWORD RULES */}
                  {form.password.length > 0 && (
                    <div className="mt-4 space-y-2">

                      <Rule valid={passwordRules.length}>
                        At least 8 characters
                      </Rule>

                      <Rule valid={passwordRules.uppercase}>
                        At least one uppercase letter
                      </Rule>

                      <Rule valid={passwordRules.lowercase}>
                        At least one lowercase letter
                      </Rule>

                      <Rule valid={passwordRules.number}>
                        At least one number
                      </Rule>

                      <Rule valid={passwordRules.special}>
                        At least one special character
                      </Rule>

                    </div>
                  )}
                </div>

                {/* CONFIRM PASSWORD */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-zinc-400">
                    Confirm Password
                  </label>

                  <div className="relative">

                    <input
                      type={showConfirm ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={(e) =>
                        updateField(
                          "confirmPassword",
                          e.target.value
                        )
                      }
                      placeholder="Enter password again"
                      autoComplete="new-password"
                      className={`w-full rounded-xl border bg-zinc-950 px-4 py-4 pr-14 text-white placeholder:text-zinc-700 outline-none transition ${
                        !passwordsMatch
                          ? "border-red-500"
                          : "border-zinc-800 focus:border-zinc-400"
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirm(!showConfirm)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-zinc-600 hover:text-white"
                    >
                      {showConfirm ? "◉" : "◌"}
                    </button>

                  </div>

                  {!passwordsMatch && (
                    <p className="mt-2 text-sm text-red-500">
                      Passwords do not match.
                    </p>
                  )}
                </div>

                {/* ERROR */}
                {error && (
                  <div className="rounded-xl border border-red-900 bg-red-950/30 px-4 py-3 text-sm text-red-400">
                    {error}
                  </div>
                )}

                {/* BUTTON */}
                <button
                  type="submit"
                  disabled={loading || !formValid}
                  className={`w-full rounded-full py-4 font-semibold uppercase tracking-[0.2em] transition ${
                    loading || !formValid
                      ? "cursor-not-allowed bg-zinc-800 text-zinc-600"
                      : "bg-white text-black hover:bg-zinc-200"
                  }`}
                >
                  {loading
                    ? "Creating..."
                    : "Sign Up"}
                </button>

              </form>

              {/* FOOTER */}
              <div className="mt-10 text-center">

                <p className="text-zinc-500">
                  Already have an account?
                </p>

                <Link
                  href="/login"
                  className="mt-2 inline-block font-medium text-white underline-offset-4 hover:underline"
                >
                  Sign In
                </Link>

              </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
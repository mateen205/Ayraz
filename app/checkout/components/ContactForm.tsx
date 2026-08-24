"use client";

interface ContactFormProps {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;

  phone: string;
  setPhone: React.Dispatch<React.SetStateAction<string>>;

  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
}

export default function ContactForm({
  name,
  setName,
  phone,
  setPhone,
  email,
  setEmail,
}: ContactFormProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-[#111111] p-6 md:p-8">

      <h2 className="text-2xl font-semibold mb-8">
        Contact Information
      </h2>

      <div className="space-y-6">

        {/* Full Name */}

        <div>

          <label className="block mb-2 text-xs uppercase tracking-[0.3em] text-zinc-500">
            Full Name
          </label>

          <input
            type="text"
            autoComplete="name"
            required
            value={name}
            maxLength={100}
            onChange={(e) => setName(e.target.value)}
            placeholder="Mateen Malik"
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none transition focus:border-white"
          />

        </div>

        {/* Email */}

        <div>

          <label className="block mb-2 text-xs uppercase tracking-[0.3em] text-zinc-500">
            Email Address
          </label>

          <input
            type="email"
            autoComplete="email"
            value={email}
            maxLength={120}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none transition focus:border-white"
          />

          <p className="mt-2 text-xs text-zinc-500">
            We'll send your order confirmation here.
          </p>

        </div>

        {/* Phone */}

        <div>

          <label className="block mb-2 text-xs uppercase tracking-[0.3em] text-zinc-500">
            Phone Number
          </label>

          <input
            type="tel"
            autoComplete="tel"
            inputMode="numeric"
            required
            value={phone}
            maxLength={11}
            onChange={(e) =>
              setPhone(
                e.target.value.replace(/\D/g, "")
              )
            }
            placeholder="03XXXXXXXXX"
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none transition focus:border-white"
          />

          <p className="mt-2 text-xs text-zinc-500">
            Used only for delivery updates.
          </p>

        </div>

      </div>

    </section>
  );
}
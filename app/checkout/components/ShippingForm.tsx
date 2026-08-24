"use client";

interface ShippingFormProps {
  country: string;

  province: string;
  setProvince: React.Dispatch<React.SetStateAction<string>>;

  city: string;
  setCity: React.Dispatch<React.SetStateAction<string>>;

  postalCode: string;
  setPostalCode: React.Dispatch<React.SetStateAction<string>>;

  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
}

export default function ShippingForm({
  country,
  province,
  setProvince,
  city,
  setCity,
  postalCode,
  setPostalCode,
  address,
  setAddress,
}: ShippingFormProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-[#111111] p-6 md:p-8">

      <h2 className="text-2xl font-semibold mb-8">
        Shipping Address
      </h2>

      <div className="grid md:grid-cols-2 gap-6">

        <div>

          <label className="block mb-2 text-xs uppercase tracking-[0.3em] text-zinc-500">
            Country
          </label>

          <input
            disabled
            value={country}
            className="w-full rounded-2xl border border-white/10 bg-zinc-800 px-5 py-4 text-zinc-400"
          />

        </div>

        <div>

          <label className="block mb-2 text-xs uppercase tracking-[0.3em] text-zinc-500">
            Province
          </label>

          <select
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 outline-none"
          >
            <option>Punjab</option>
            <option>Sindh</option>
            <option>KPK</option>
            <option>Balochistan</option>
            <option>Gilgit Baltistan</option>
            <option>AJK</option>
          </select>

        </div>

        <div>

          <label className="block mb-2 text-xs uppercase tracking-[0.3em] text-zinc-500">
            City
          </label>

          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Faisalabad"
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none transition focus:border-white"
          />

        </div>

        <div>

          <label className="block mb-2 text-xs uppercase tracking-[0.3em] text-zinc-500">
            Postal Code
          </label>

          <input
            value={postalCode}
            inputMode="numeric"
            maxLength={8}
            onChange={(e) =>
              setPostalCode(e.target.value.replace(/\D/g, ""))
            }
            placeholder="38000"
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none transition focus:border-white"
          />

        </div>

        <div className="md:col-span-2">

          <label className="block mb-2 text-xs uppercase tracking-[0.3em] text-zinc-500">
            Complete Address
          </label>

          <textarea
            rows={5}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="House #, Street, Area..."
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 outline-none resize-none transition focus:border-white"
          />

        </div>

      </div>

    </section>
  );
}
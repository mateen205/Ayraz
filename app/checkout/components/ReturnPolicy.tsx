"use client";

import { ShieldCheck, RotateCcw, Truck, Clock } from "lucide-react";

export default function ReturnPolicy() {
  return (
    <section className="rounded-3xl border border-white/10 bg-[#111111] p-6 md:p-8">

      <h2 className="text-2xl font-bold mb-8">
        Returns & Store Policy
      </h2>

      <div className="space-y-6">

        <div className="flex gap-4">

          <RotateCcw className="mt-1 text-white" size={22} />

          <div>

            <h3 className="font-semibold">
              7 Day Exchange Policy
            </h3>

            <p className="text-zinc-400 mt-1 leading-7">
              Products can be exchanged within 7 days of receiving
              your parcel. Items must be unused, unwashed and
              returned in their original condition with all tags
              attached.
            </p>

          </div>

        </div>

        <div className="flex gap-4">

          <Truck className="mt-1 text-white" size={22} />

          <div>

            <h3 className="font-semibold">
              Nationwide Delivery
            </h3>

            <p className="text-zinc-400 mt-1 leading-7">
              AYRAZ delivers across Pakistan.
              Standard delivery usually takes
              2–4 working days while Express
              delivery takes 1–2 working days.
            </p>

          </div>

        </div>

        <div className="flex gap-4">

          <ShieldCheck className="mt-1 text-white" size={22} />

          <div>

            <h3 className="font-semibold">
              Secure Ordering
            </h3>

            <p className="text-zinc-400 mt-1 leading-7">
              Your personal information is protected.
              We never share your data with third parties
              except trusted courier partners required
              for delivery.
            </p>

          </div>

        </div>

        <div className="flex gap-4">

          <Clock className="mt-1 text-white" size={22} />

          <div>

            <h3 className="font-semibold">
              Order Confirmation
            </h3>

            <p className="text-zinc-400 mt-1 leading-7">
              You'll receive an email immediately after
              placing your order.
              Once dispatched, you'll receive another
              confirmation with delivery updates.
            </p>

          </div>

        </div>

      </div>

      <div className="mt-10 rounded-2xl border border-white/10 bg-black/40 p-5">

        <h3 className="font-semibold mb-3">
          Important
        </h3>

        <ul className="space-y-2 text-sm text-zinc-400">

          <li>• Cash on Delivery available nationwide.</li>

          <li>• Exchange available only for size issues or damaged products.</li>

          <li>• Sale items cannot be exchanged unless damaged.</li>

          <li>• Please verify your phone number before placing an order.</li>

        </ul>

      </div>

    </section>
  );
}
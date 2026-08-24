"use client";

import { Wallet } from "lucide-react";

interface PaymentSectionProps {
  paymentMethod: string;
  setPaymentMethod: React.Dispatch<React.SetStateAction<string>>;
}

export default function PaymentSection({
  paymentMethod,
  setPaymentMethod,
}: PaymentSectionProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-[#111111] p-6 md:p-8">

      <div className="flex items-center gap-3 mb-8">
        <Wallet size={24} />
        <h2 className="text-2xl font-semibold">
          Payment Method
        </h2>
      </div>

      <div className="space-y-4">

        <label className="flex items-center justify-between rounded-2xl border border-white/10 p-5 cursor-pointer hover:border-white transition">

          <div className="flex items-center gap-4">

            <input
              type="radio"
              checked={paymentMethod === "cod"}
              onChange={() => setPaymentMethod("cod")}
            />

            <div>

              <p className="font-semibold">
                Cash on Delivery
              </p>

              <p className="text-sm text-zinc-500">
                Pay when your order arrives.
              </p>

            </div>

          </div>

        </label>

        <label className="flex items-center justify-between rounded-2xl border border-white/10 p-5 opacity-60">

          <div className="flex items-center gap-4">

            <input disabled type="radio" />

            <div>

              <p className="font-semibold">
                JazzCash
              </p>

              <p className="text-sm text-zinc-500">
                Coming Soon
              </p>

            </div>

          </div>

        </label>

        <label className="flex items-center justify-between rounded-2xl border border-white/10 p-5 opacity-60">

          <div className="flex items-center gap-4">

            <input disabled type="radio" />

            <div>

              <p className="font-semibold">
                Easypaisa
              </p>

              <p className="text-sm text-zinc-500">
                Coming Soon
              </p>

            </div>

          </div>

        </label>

      </div>

    </section>
  );
}
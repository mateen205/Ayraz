"use client";

import { Truck } from "lucide-react";

interface DeliveryMethodProps {
  deliveryMethod: string;
  setDeliveryMethod: React.Dispatch<React.SetStateAction<string>>;
}

export default function DeliveryMethod({
  deliveryMethod,
  setDeliveryMethod,
}: DeliveryMethodProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-[#111111] p-6 md:p-8">

      <div className="flex items-center gap-3 mb-8">

        <Truck size={24} />

        <h2 className="text-2xl font-semibold">
          Delivery Method
        </h2>

      </div>

      <div className="space-y-5">

        <label className="flex items-center justify-between rounded-2xl border border-white/10 p-5 cursor-pointer transition hover:border-white">

          <div className="flex items-center gap-4">

            <input
              type="radio"
              checked={deliveryMethod === "standard"}
              onChange={() => setDeliveryMethod("standard")}
            />

            <div>

              <p className="font-semibold">
                Standard Delivery
              </p>

              <p className="text-sm text-zinc-500">
                2–4 Working Days
              </p>

            </div>

          </div>

          <span className="font-semibold">
            FREE
          </span>

        </label>

        <label className="flex items-center justify-between rounded-2xl border border-white/10 p-5 cursor-pointer transition hover:border-white">

          <div className="flex items-center gap-4">

            <input
              type="radio"
              checked={deliveryMethod === "express"}
              onChange={() => setDeliveryMethod("express")}
            />

            <div>

              <p className="font-semibold">
                Express Delivery
              </p>

              <p className="text-sm text-zinc-500">
                1–2 Working Days
              </p>

            </div>

          </div>

          <span className="font-semibold">
            PKR 350
          </span>

        </label>

      </div>

    </section>
  );
}
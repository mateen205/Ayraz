"use client";

import Image from "next/image";
import { useCurrency } from "../../components/CurrencyContext";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
}

interface Offer {
  name: string;
}

interface OrderSummaryProps {
  cart: CartItem[];
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  activeOffer: Offer | null;
  discountedSubtotal: number;
  shipping: number;
  loading: boolean;
  placeOrder: () => void;
}

export default function OrderSummary({
  cart,
  subtotal,
  discountPercent,
  discountAmount,
  activeOffer,
  discountedSubtotal,
  shipping,
  loading,
  placeOrder,
}: OrderSummaryProps) {
  const { formatPrice } = useCurrency();

  const total = discountedSubtotal + shipping;

  return (
    <aside className="xl:sticky xl:top-28 h-fit rounded-3xl border border-white/10 bg-[#111111] p-7">

      <h2 className="text-3xl font-bold mb-8">
        Order Summary
      </h2>

      <div className="space-y-5 max-h-[420px] overflow-y-auto pr-2">

        {cart.length === 0 ? (
          <p className="text-zinc-500">
            Your cart is empty.
          </p>
        ) : (
          cart.map((item) => (
            <div
              key={`${item.id}-${item.size}`}
              className="flex gap-4"
            >

              <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-zinc-900">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1">

                <h3 className="font-semibold">
                  {item.name}
                </h3>

                <p className="text-sm text-zinc-500">
                  Size {item.size}
                </p>

                <p className="text-sm text-zinc-500">
                  Qty {item.quantity}
                </p>

              </div>

              <div className="font-semibold">
                {formatPrice(
                  Number(item.price) * Number(item.quantity)
                )}
              </div>

            </div>
          ))
        )}

      </div>

      <div className="border-t border-white/10 my-8" />

      <div className="space-y-4">

        <div className="flex justify-between">

          <span className="text-zinc-400">
            Subtotal
          </span>

          <span>
            {formatPrice(Number(subtotal))}
          </span>

        </div>

        {activeOffer && discountAmount > 0 && (
          <div className="rounded-2xl border border-green-800 bg-green-950/30 p-4 text-green-400">

            <div className="flex justify-between gap-4 font-semibold">

              <span>
                {activeOffer.name}
              </span>

              <span>
                -{discountPercent}%
              </span>

            </div>

            <div className="mt-2 flex justify-between text-sm">

              <span>
                Amount saved
              </span>

              <span>
                − {formatPrice(Number(discountAmount))}
              </span>

            </div>

          </div>
        )}

        {discountAmount > 0 && (
          <div className="flex justify-between">

            <span className="text-zinc-400">
              After discount
            </span>

            <span>
              {formatPrice(Number(discountedSubtotal))}
            </span>

          </div>
        )}

        <div className="flex justify-between">

          <span className="text-zinc-400">
            Shipping
          </span>

          <span>
            {shipping === 0
              ? "FREE"
              : formatPrice(Number(shipping))}
          </span>

        </div>

        <div className="flex justify-between">

          <span className="text-zinc-400">
            Taxes
          </span>

          <span>
            Included
          </span>

        </div>

      </div>

      <div className="border-t border-white/10 my-8" />

      <div className="flex justify-between text-2xl font-bold">

        <span>
          Total
        </span>

        <span>
          {formatPrice(Number(total))}
        </span>

      </div>

      <button
        onClick={placeOrder}
        disabled={loading || cart.length === 0}
        className="mt-8 w-full rounded-full bg-white py-4 font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? "Placing Order..."
          : "Place Order"}
      </button>

      <div className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-5">

        <h3 className="mb-3 font-semibold">
          Secure Checkout
        </h3>

        <ul className="space-y-2 text-sm text-zinc-400">

          <li>✓ Secure order processing</li>

          <li>✓ Cash on Delivery available</li>

          <li>✓ Nationwide Shipping</li>

          <li>✓ Easy Returns & Exchanges</li>

        </ul>

      </div>

    </aside>
  );
}
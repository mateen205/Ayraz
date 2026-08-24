"use client";

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { useCart } from "./CartContext";
import { useCurrency } from "./CurrencyContext";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({
  open,
  onClose,
}: CartDrawerProps) {
  const {
    cart,
    totalPrice,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  const { formatPrice } = useCurrency();

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open
            ? "opacity-100 visible"
            : "opacity-0 invisible"
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-screen w-full max-w-md bg-[#0b0b0b] border-l border-white/10 transition-transform duration-500 ease-in-out ${
          open
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-7 border-b border-white/10">
          <h2 className="text-xl tracking-[0.35em] uppercase">
            Cart
          </h2>

          <button
            onClick={onClose}
            aria-label="Close cart"
            className="text-white"
          >
            <X
              size={24}
              className="hover:text-zinc-400 transition"
            />
          </button>
        </div>

        {/* Empty Cart */}
        {cart.length === 0 ? (
          <div className="flex h-[80%] flex-col items-center justify-center px-8 text-center">
            <p className="text-zinc-400 uppercase tracking-[0.25em]">
              Your cart is empty.
            </p>

            <p className="mt-4 text-sm text-zinc-600">
              Add your first AYRAZ piece.
            </p>
          </div>
        ) : (
          <div className="flex flex-col h-[calc(100%-90px)]">
            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="flex gap-4"
                >
                  {/* Product Image */}
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={90}
                    height={110}
                    className="rounded-lg object-cover w-[90px] h-[110px]"
                  />

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate">
                      {item.name}
                    </h3>

                    <p className="text-zinc-400 text-sm mt-1">
                      Size: {item.size}
                    </p>

                    <p className="mt-2 font-medium">
                      {formatPrice(Number(item.price))}
                    </p>

                    {/* Quantity */}
                    <div className="flex items-center gap-3 mt-4">
                      <button
                        onClick={() =>
                          decreaseQuantity(
                            item.id,
                            item.size
                          )
                        }
                        className="w-8 h-8 rounded-full border border-zinc-700 hover:border-white transition"
                      >
                        −
                      </button>

                      <span className="min-w-[20px] text-center">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          increaseQuantity(
                            item.id,
                            item.size
                          )
                        }
                        className="w-8 h-8 rounded-full border border-zinc-700 hover:border-white transition"
                      >
                        +
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() =>
                        removeFromCart(
                          item.id,
                          item.size
                        )
                      }
                      className="text-red-400 text-sm mt-4 hover:text-red-300 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 p-6 bg-[#0b0b0b]">
              <div className="flex justify-between text-lg font-semibold mb-6">
                <span>Subtotal</span>

                <span>
                  {formatPrice(Number(totalPrice))}
                </span>
              </div>

              <Link
                href="/cart"
                onClick={onClose}
                className="block w-full bg-white text-black text-center py-3 rounded-full font-semibold hover:bg-zinc-200 transition"
              >
                View Cart
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
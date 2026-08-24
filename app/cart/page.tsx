"use client";

import { useCart } from "../components/CartContext";
import { useCurrency } from "../components/CurrencyContext";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();

  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    totalItems,
    subtotal,
    discountPercent,
    discountAmount,
    totalPrice,
    activeOffer,
    offers,
  } = useCart();

  const { formatPrice } = useCurrency();

  /*
   * Find the next offer the customer can unlock
   */
  const nextOffer =
    offers
      .filter(
        (offer) =>
          Number(offer.active) === 1 &&
          Number(offer.applies_to_all) === 1 &&
          Number(offer.min_quantity) > totalItems
      )
      .sort(
        (a, b) =>
          Number(a.min_quantity) -
          Number(b.min_quantity)
      )[0] || null;

  const remaining = nextOffer
    ? Number(nextOffer.min_quantity) - totalItems
    : 0;

  const offerProgress = nextOffer
    ? Math.min(
        100,
        (totalItems / Number(nextOffer.min_quantity)) * 100
      )
    : 100;

  return (
    <main className="min-h-screen bg-black text-white pt-24 px-6 pb-20">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-12">
          <p className="uppercase tracking-[0.35em] text-zinc-500 text-xs mb-3">
            AYRAZ
          </p>

          <h1 className="text-5xl font-bold">
            Shopping Cart
          </h1>

          {totalItems > 0 && (
            <p className="text-zinc-500 mt-3">
              {totalItems}{" "}
              {totalItems === 1 ? "shirt" : "shirts"} in your bag
            </p>
          )}
        </div>

        {cart.length === 0 ? (

          /* EMPTY CART */
          <div className="border border-zinc-800 rounded-2xl p-12 text-center">
            <h2 className="text-2xl font-semibold">
              Your cart is empty.
            </h2>

            <p className="text-zinc-500 mt-3">
              Discover the latest AYRAZ collection.
            </p>

            <button
              onClick={() => router.push("/")}
              className="mt-8 bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-zinc-200 transition"
            >
              CONTINUE SHOPPING
            </button>
          </div>

        ) : (

          <div className="grid lg:grid-cols-[1fr_380px] gap-10">

            {/* CART ITEMS */}
            <div className="space-y-6">

              {cart.map((item) => (

                (() => {
                  const productQuantity = cart
                    .filter(
                      (cartItem) =>
                        cartItem.id === item.id
                    )
                    .reduce(
                      (sum, cartItem) =>
                        sum + cartItem.quantity,
                      0
                    );

                  const reachedStockLimit =
                    productQuantity >= item.stock;

                  return (
                    <div
                      key={`${item.id}-${item.size}`}
                      className="bg-zinc-900 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center"
                    >

                      <Image
                        src={item.image}
                        alt={item.name}
                        width={140}
                        height={170}
                        className="rounded-xl object-cover"
                      />

                      <div className="flex-1 w-full">

                        <h2 className="text-2xl font-semibold">
                          {item.name}
                        </h2>

                        <p className="text-zinc-400 mt-2">
                          Size: {item.size}
                        </p>

                        {/* CURRENCY */}
                        <p className="mt-3 font-semibold">
                          {formatPrice(Number(item.price))}
                        </p>

                      </div>

                      {/* QUANTITY */}
                      <div className="flex items-center gap-4">

                        <button
                          onClick={() =>
                            decreaseQuantity(
                              item.id,
                              item.size
                            )
                          }
                          disabled={item.quantity <= 1}
                          className="w-10 h-10 border border-zinc-700 rounded-full hover:border-white transition disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          −
                        </button>

                        <span className="text-xl font-semibold min-w-[20px] text-center">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            increaseQuantity(
                              item.id,
                              item.size
                            )
                          }
                          disabled={reachedStockLimit}
                          className="w-10 h-10 border border-zinc-700 rounded-full hover:border-white transition disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          +
                        </button>

                      </div>

                      {/* REMOVE */}
                      <button
                        onClick={() =>
                          removeFromCart(
                            item.id,
                            item.size
                          )
                        }
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Remove
                      </button>

                    </div>
                  );
                })()

              ))}

            </div>

            {/* ORDER SUMMARY */}
            <div className="lg:sticky lg:top-28 h-fit">

              <div className="bg-zinc-900 rounded-2xl p-7">

                <h2 className="text-2xl font-bold mb-7">
                  Order Summary
                </h2>

                {/* SUBTOTAL */}
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>

                  <span className="text-white">
                    {formatPrice(Number(subtotal))}
                  </span>
                </div>

                {/* OFFERS */}
                {offers.length > 0 && (
                  <section className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-800 to-black">

                    <div className="p-4">

                      <div className="flex items-start justify-between gap-3">

                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400">
                            AYRAZ rewards
                          </p>

                          <h3 className="mt-1 text-lg font-bold">
                            Buy more. Save more.
                          </h3>
                        </div>

                        <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-black text-black">
                          UP TO 30% OFF
                        </span>

                      </div>

                      <p className="mt-3 text-sm text-zinc-300">
                        {nextOffer
                          ? `Add ${remaining} more ${
                              remaining === 1
                                ? "tee"
                                : "tees"
                            } to unlock ${
                              Number(
                                nextOffer.discount_percent
                              )
                            }% OFF.`
                          : "You have unlocked our best available offer."}
                      </p>

                      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-green-400 transition-all"
                          style={{
                            width: `${offerProgress}%`,
                          }}
                        />
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2">

                        {offers
                          .filter(
                            (offer) =>
                              Number(offer.active) === 1 &&
                              Number(
                                offer.applies_to_all
                              ) === 1
                          )
                          .sort(
                            (a, b) =>
                              Number(a.min_quantity) -
                              Number(b.min_quantity)
                          )
                          .map((offer) => {

                            const unlocked =
                              totalItems >=
                              Number(
                                offer.min_quantity
                              );

                            return (
                              <div
                                key={offer.id}
                                className={`rounded-xl border px-3 py-3 ${
                                  unlocked
                                    ? "border-green-400 bg-green-400 text-black"
                                    : "border-white/10 bg-black/30"
                                }`}
                              >

                                <p
                                  className={`text-[10px] font-bold uppercase tracking-wider ${
                                    unlocked
                                      ? "text-black/60"
                                      : "text-zinc-500"
                                  }`}
                                >
                                  {unlocked
                                    ? "Unlocked"
                                    : "Unlock at"}
                                </p>

                                <p className="mt-1 text-sm font-black">
                                  BUY {offer.min_quantity}
                                </p>

                                <p className="mt-1 text-xl font-black">
                                  {Number(
                                    offer.discount_percent
                                  )}% OFF
                                </p>

                              </div>
                            );
                          })}

                      </div>

                      {/* OFFER SAVINGS */}
                      {activeOffer && discountAmount > 0 && (
                        <p className="mt-4 text-sm font-semibold text-green-400">
                          {activeOffer.name} applied — you save{" "}
                          {formatPrice(
                            Number(discountAmount)
                          )}.
                        </p>
                      )}

                    </div>

                  </section>
                )}

                {/* TOTAL */}
                <div className="border-t border-zinc-800 mt-7 pt-6">

                  <div className="flex justify-between items-end">

                    <span className="text-xl font-semibold">
                      Total
                    </span>

                    <span className="text-3xl font-bold">
                      {formatPrice(Number(totalPrice))}
                    </span>

                  </div>

                </div>

                {/* SAVINGS */}
                {discountAmount > 0 && (
                  <div className="mt-4 text-center text-green-400 text-sm font-medium">
                    You saved{" "}
                    {formatPrice(
                      Number(discountAmount)
                    )}
                  </div>
                )}

                {/* CHECKOUT */}
                <button
                  onClick={() =>
                    router.push("/checkout")
                  }
                  className="mt-7 w-full bg-white text-black py-4 rounded-full font-semibold hover:bg-zinc-200 transition"
                >
                  CHECKOUT
                </button>

              </div>

            </div>

          </div>

        )}

      </div>
    </main>
  );
}
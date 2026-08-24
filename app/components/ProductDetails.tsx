"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartContext";
import { useCurrency } from "./CurrencyContext";

type Props = {
  id: string;
  name: string;
  price: number;
  salePrice: number | null;
  onSale: boolean;
  stock: number;
  image: string;
};

type Offer = {
  id: number;
  name: string;
  min_quantity: number;
  discount_percent: number;
  active: number;
  applies_to_all: number;
};

export default function ProductDetails({
  id,
  name,
  price,
  salePrice,
  onSale,
  stock,
  image,
}: Props) {
  const router = useRouter();
  const { addToCart } = useCart();

  const { formatPrice } = useCurrency();

  const sizes = ["S", "M", "L", "XL"];

  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [offers, setOffers] = useState<Offer[]>([]);

  useEffect(() => {
    async function loadOffers() {
      try {
        const res = await fetch("/api/offers", {
          cache: "no-store",
        });

        const data = await res.json();

        if (data.success) {
          setOffers(data.offers);
        }
      } catch (error) {
        console.error("Failed to load offers:", error);
      }
    }

    loadOffers();
  }, []);

  /*
   * DATABASE PRICES ARE ALWAYS IN PKR.
   *
   * We keep all calculations in PKR.
   * CurrencyContext only changes how prices are displayed.
   */

  const finalPrice =
    onSale && salePrice
      ? Number(salePrice)
      : Number(price);

  const discount =
    onSale && salePrice
      ? Math.round(
          ((Number(price) - Number(salePrice)) /
            Number(price)) *
            100
        )
      : 0;

  /*
   * Find the highest qualifying offer.
   *
   * Example:
   * BUY 2 = 10%
   * BUY 3 = 20%
   *
   * Quantity 3 uses the 20% offer.
   */

  const applicableOffer =
    offers
      .filter(
        (offer) =>
          Number(offer.active) === 1 &&
          Number(offer.applies_to_all) === 1 &&
          quantity >= Number(offer.min_quantity)
      )
      .sort(
        (a, b) =>
          Number(b.min_quantity) -
          Number(a.min_quantity)
      )[0] || null;

  /*
   * Find the next available offer.
   */

  const nextOffer =
    offers
      .filter(
        (offer) =>
          Number(offer.active) === 1 &&
          Number(offer.applies_to_all) === 1 &&
          quantity < Number(offer.min_quantity)
      )
      .sort(
        (a, b) =>
          Number(a.min_quantity) -
          Number(b.min_quantity)
      )[0] || null;

  const shirtsUntilNextOffer = nextOffer
    ? Number(nextOffer.min_quantity) - quantity
    : 0;

  const offerDiscount = applicableOffer
    ? Number(applicableOffer.discount_percent)
    : 0;

  /*
   * Offer calculations remain in PKR.
   */

  const discountedUnitPrice = applicableOffer
    ? finalPrice * (1 - offerDiscount / 100)
    : finalPrice;

  const totalOfferSavings =
    (finalPrice - discountedUnitPrice) *
    quantity;

  /*
   * ADD TO CART
   *
   * IMPORTANT:
   * We store the original PKR price.
   * Currency is only for display.
   */

  function handleAddToCart() {
    if (stock <= 0) return;

    addToCart({
      id,
      name,
      price: finalPrice,
      image,
      size: selectedSize,
      quantity,
      stock,
    });

    router.push("/cart");
  }

  return (
    <div className="sticky top-24 w-full max-w-[460px]">

      {/* BRAND */}

      <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
        AYRAZ
      </p>

      {/* PRODUCT NAME */}

      <h1 className="mt-2 text-4xl font-bold lg:text-5xl">
        {name}
      </h1>

      {/* SOLD OUT */}

      {stock <= 0 && (
        <div className="mt-5 inline-flex rounded-full border border-red-500 px-4 py-2 font-semibold tracking-wider text-red-400">
          SOLD OUT
        </div>
      )}

      {/* PRICE */}

      {onSale ? (
        <div className="mt-5">

          <div className="flex items-center gap-3">

            <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-black">
              -{discount}%
            </span>

            <span className="text-3xl font-bold">
              {formatPrice(finalPrice)}
            </span>

          </div>

          <p className="mt-2 text-zinc-500 line-through">
            {formatPrice(Number(price))}
          </p>

        </div>
      ) : (
        <p className="mt-5 text-3xl font-semibold">
          {formatPrice(Number(price))}
        </p>
      )}

      {/* DESCRIPTION */}

      <p className="mt-6 leading-7 text-zinc-400">
        Premium oversized tee designed for everyday wear.
        Crafted in Pakistan using heavyweight cotton with a
        relaxed streetwear silhouette.
      </p>

      {/* SIZE */}

      <div className="mt-8">

        <h3 className="mb-3 font-semibold">
          Select Size
        </h3>

        <div className="flex flex-wrap gap-3">

          {sizes.map((size) => (
            <button
              key={size}
              onClick={() =>
                setSelectedSize(size)
              }
              disabled={stock <= 0}
              className={`h-12 w-12 rounded-full border transition ${
                selectedSize === size
                  ? "border-white bg-white text-black"
                  : "border-zinc-700 hover:border-white"
              } ${
                stock <= 0
                  ? "cursor-not-allowed opacity-40"
                  : ""
              }`}
            >
              {size}
            </button>
          ))}

        </div>

      </div>

      {/* BUY MORE OFFER */}

      {offers.length > 0 && (
        <section className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black">

          {/* OFFER HEADER */}

          <div className="border-b border-white/10 px-5 py-4">

            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-zinc-400">
              AYRAZ rewards
            </p>

            <div className="mt-2 flex items-end justify-between gap-4">

              <h3 className="text-xl font-bold leading-tight">
                Buy more. Save more.
              </h3>

              <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-black">
                UP TO 30% OFF
              </span>

            </div>

            <p className="mt-3 text-sm text-zinc-400">
              {nextOffer
                ? `Add ${shirtsUntilNextOffer} more ${
                    shirtsUntilNextOffer === 1
                      ? "tee"
                      : "tees"
                  } to unlock ${Number(
                    nextOffer.discount_percent
                  )}% OFF.`
                : "You have unlocked our best available offer."}
            </p>

          </div>

          {/* OFFER CARDS */}

          <div className="grid grid-cols-2 gap-3 p-4">

            {offers
              .filter(
                (offer) =>
                  Number(offer.active) === 1 &&
                  Number(
                    offer.applies_to_all
                  ) === 1
              )
              .map((offer) => {

                const isSelected =
                  quantity >=
                  Number(
                    offer.min_quantity
                  );

                return (
                  <div
                    key={offer.id}
                    className={`relative overflow-hidden rounded-2xl border p-4 transition ${
                      isSelected
                        ? "border-green-400 bg-green-400 text-black"
                        : "border-zinc-800 bg-black text-white"
                    }`}
                  >

                    <p
                      className={`text-[10px] font-bold uppercase tracking-[0.18em] ${
                        isSelected
                          ? "text-black/60"
                          : "text-zinc-500"
                      }`}
                    >
                      {isSelected
                        ? "Unlocked"
                        : "Unlock at"}
                    </p>

                    <p className="mt-2 text-2xl font-black leading-none">
                      BUY {offer.min_quantity}
                    </p>

                    <div
                      className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-black ${
                        isSelected
                          ? "bg-black text-white"
                          : "bg-white text-black"
                      }`}
                    >
                      {Number(
                        offer.discount_percent
                      )}
                      % OFF
                    </div>

                  </div>
                );
              })}

          </div>

          {/* ACTIVE OFFER SUMMARY */}

          {applicableOffer && (
            <div className="mx-4 mb-4 rounded-2xl border border-green-400/30 bg-green-400/10 p-4">

              <p className="text-sm font-bold text-green-400">
                {applicableOffer.name} is active
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                You save{" "}
                {formatPrice(
                  totalOfferSavings
                )}
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                Your offer price:{" "}
                {formatPrice(
                  discountedUnitPrice
                )}{" "}
                per shirt
              </p>

            </div>
          )}

        </section>
      )}

      {/* QUANTITY */}

      <div className="mt-8">

        <h3 className="mb-3 font-semibold">
          Quantity
        </h3>

        <div className="flex items-center gap-4">

          <button
            disabled={stock <= 0}
            onClick={() =>
              setQuantity((prev) =>
                prev > 1
                  ? prev - 1
                  : 1
              )
            }
            className="h-10 w-10 rounded-full border border-zinc-700 hover:border-white disabled:opacity-40"
          >
            −
          </button>

          <span className="text-lg font-semibold">
            {quantity}
          </span>

          <button
            disabled={
              stock <= 0 ||
              quantity >= stock
            }
            onClick={() =>
              setQuantity((prev) =>
                prev < stock
                  ? prev + 1
                  : prev
              )
            }
            className="h-10 w-10 rounded-full border border-zinc-700 hover:border-white disabled:opacity-40"
          >
            +
          </button>

        </div>

      </div>

      {/* ADD TO CART */}

      <button
        onClick={handleAddToCart}
        disabled={stock <= 0}
        className={`mt-8 w-full rounded-full py-3 font-semibold transition ${
          stock > 0
            ? "bg-white text-black hover:bg-zinc-200"
            : "cursor-not-allowed bg-zinc-800 text-zinc-500"
        }`}
      >
        {stock > 0
          ? "ADD TO CART"
          : "SOLD OUT"}
      </button>

      {/* PRODUCT INFORMATION */}

      <div className="mt-8 space-y-4 border-t border-zinc-800 pt-6 text-sm text-zinc-400">

        <div className="flex justify-between">
          <span>Fabric</span>
          <span>100% Cotton</span>
        </div>

        <div className="flex justify-between">
          <span>Fit</span>
          <span>Oversized</span>
        </div>

        <div className="flex justify-between">
          <span>Origin</span>
          <span>Pakistan</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span>3–5 Days</span>
        </div>

      </div>

    </div>
  );
}
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useCurrency } from "./CurrencyContext";

export default function Featured() {
  const [products, setProducts] = useState<any[]>([]);
  const [currencyOpen, setCurrencyOpen] = useState(false);

  const {
    currency,
    currencies,
    setCurrency,
    formatPrice,
  } = useCurrency();

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    }

    loadProducts();
  }, []);

  return (
    <section className="bg-black px-8 py-32 text-white">
      <div className="mx-auto max-w-7xl">

        {/* SECTION HEADER */}
        <div className="relative">

          <p className="uppercase tracking-[0.4em] text-zinc-500">
            Current Drop
          </p>

          {/* DROP TITLE + CURRENCY */}
          <div className="mt-4 flex items-center justify-between gap-4">

            <h2 className="text-5xl font-bold">
              DROP 01
            </h2>

            {/* CURRENCY SELECTOR */}
            <div className="relative shrink-0">

              <button
                type="button"
                onClick={() =>
                  setCurrencyOpen((open) => !open)
                }
                className="
                  flex items-center gap-2
                  rounded-full
                  border border-zinc-800
                  bg-zinc-950
                  px-3 py-2
                  text-xs
                  font-medium
                  uppercase
                  tracking-[0.12em]
                  text-zinc-300
                  transition
                  hover:border-zinc-600
                  hover:text-white
                "
              >
                <span className="text-base">
                  {currency.flag}
                </span>

                <span>
                  {currency.code}
                </span>

                <ChevronDown
                  size={13}
                  className={`transition-transform duration-200 ${
                    currencyOpen
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              {currencyOpen && (
                <div
                  className="
                    absolute
                    right-0
                    top-12
                    z-50
                    w-36
                    overflow-hidden
                    rounded-xl
                    border
                    border-white/10
                    bg-zinc-950/95
                    p-1.5
                    shadow-2xl
                    backdrop-blur-xl
                  "
                >
                  {currencies.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => {
                        setCurrency(item.code);
                        setCurrencyOpen(false);
                      }}
                      className={`
                        flex
                        w-full
                        items-center
                        gap-2.5
                        rounded-lg
                        px-3
                        py-2.5
                        text-left
                        text-xs
                        transition
                        ${
                          currency.code === item.code
                            ? "bg-white/10 text-white"
                            : "text-zinc-400 hover:bg-white/5 hover:text-white"
                        }
                      `}
                    >
                      <span className="text-base">
                        {item.flag}
                      </span>

                      <span className="font-medium">
                        {item.code}
                      </span>

                      {currency.code === item.code && (
                        <span className="ml-auto text-[10px]">
                          ✓
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <p className="mt-6 max-w-xl text-zinc-400">
            Five oversized tees.
            Designed in Pakistan.
            Premium quality.
          </p>
        </div>

        {/* PRODUCTS */}
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

          {products.map((product) => {

            const discount =
              product.on_sale &&
              Number(product.price) > 0
                ? Math.round(
                    ((Number(product.price) -
                      Number(product.sale_price)) /
                      Number(product.price)) *
                      100
                  )
                : 0;

            const soldOut =
              Number(product.stock) <= 0;

            return (
              <Link
                href={`/product/${product.id}`}
                key={product.id}
                className="
                  group
                  overflow-hidden
                  rounded-2xl
                  bg-zinc-900
                  transition
                  duration-500
                  hover:scale-[1.02]
                "
              >

                {/* PRODUCT IMAGE */}
                <div className="relative overflow-hidden">

                  <Image
                    src={product.image1}
                    alt={product.name}
                    width={600}
                    height={700}
                    className={`
                      h-[420px]
                      w-full
                      object-cover
                      transition
                      duration-500
                      ${
                        soldOut
                          ? "brightness-50"
                          : "group-hover:scale-110"
                      }
                    `}
                  />

                  {soldOut && (
                    <div className="absolute inset-0 flex items-center justify-center">

                      <div
                        className="
                          rounded-full
                          border
                          border-white
                          bg-black/70
                          px-6
                          py-3
                          backdrop-blur-sm
                        "
                      >
                        <span
                          className="
                            text-sm
                            font-bold
                            tracking-[0.25em]
                            text-white
                          "
                        >
                          SOLD OUT
                        </span>
                      </div>

                    </div>
                  )}

                </div>

                {/* PRODUCT INFO */}
                <div className="p-6">

                  <h3 className="text-2xl font-semibold">
                    {product.name}
                  </h3>

                  {product.on_sale ? (

                    <div className="mt-4">

                      <div className="flex items-center gap-3">

                        <span
                          className="
                            rounded-full
                            bg-white
                            px-3
                            py-1
                            text-xs
                            font-bold
                            text-black
                          "
                        >
                          -{discount}%
                        </span>

                        <span className="text-2xl font-bold">
                          {formatPrice(
                            Number(product.sale_price)
                          )}
                        </span>

                      </div>

                      <p className="mt-2 text-zinc-500 line-through">
                        {formatPrice(
                          Number(product.price)
                        )}
                      </p>

                    </div>

                  ) : (

                    <p
                      className="
                        mt-4
                        text-xl
                        font-medium
                        text-zinc-400
                      "
                    >
                      {formatPrice(
                        Number(product.price)
                      )}
                    </p>

                  )}

                </div>

              </Link>
            );
          })}

        </div>

      </div>
    </section>
  );
}
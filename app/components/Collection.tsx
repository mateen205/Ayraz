"use client";

import Image from "next/image";

const products = [
  {
    id: 1,
    name: "DROP 01",
    price: "Rs. 3,490",
    image: "/images/tee1.png",
  },
  {
    id: 2,
    name: "DROP 02",
    price: "Rs. 3,490",
    image: "/images/tee2.png",
  },
  {
    id: 3,
    name: "DROP 03",
    price: "Rs. 3,490",
    image: "/images/tee3.png",
  },
  {
    id: 4,
    name: "DROP 04",
    price: "Rs. 3,490",
    image: "/images/tee4.png",
  },
  {
    id: 5,
    name: "DROP 05",
    price: "Rs. 3,490",
    image: "/images/tee5.png",
  },
];

export default function Collection() {
  return (
    <section
      id="collection"
      className="bg-black text-white py-32"
    >
      <div className="max-w-7xl mx-auto px-8">

        <div className="mb-20">

          <p className="uppercase tracking-[0.45em] text-zinc-500 text-sm">
            AYRAZ
          </p>

          <h2 className="mt-4 text-5xl md:text-7xl font-bold">
            COLLECTION
          </h2>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">

          {products.map((product) => (
            <div
              key={product.id}
              className="group"
            >

              <div className="bg-[#111] rounded-3xl overflow-hidden aspect-square flex items-center justify-center">

                <Image
                  src={product.image}
                  alt={product.name}
                  width={650}
                  height={650}
                  className="object-contain w-[82%] transition duration-500 group-hover:scale-105"
                />

              </div>

              <div className="mt-8 flex items-center justify-between">

                <div>

                  <h3 className="text-xl font-medium">
                    {product.name}
                  </h3>

                  <p className="text-zinc-500 mt-2">
                    {product.price}
                  </p>

                </div>

                <button className="border border-white px-5 py-3 uppercase text-xs tracking-[0.25em] hover:bg-white hover:text-black transition">
                  ADD
                </button>

              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}
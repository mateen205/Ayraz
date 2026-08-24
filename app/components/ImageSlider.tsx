"use client";

import { useState } from "react";
import Image from "next/image";

type Props = {
  images: string[];
  name: string;
};

export default function ImageSlider({ images, name }: Props) {
  const [current, setCurrent] = useState(0);

  const nextImage = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="w-full">

      <div className="relative bg-zinc-900 rounded-2xl overflow-hidden">

        <Image
          src={images[current]}
          alt={name}
          width={700}
          height={900}
          className="w-full h-[650px] object-contain"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 text-white text-xl hover:bg-white hover:text-black transition"
            >
              ←
            </button>

            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 text-white text-xl hover:bg-white hover:text-black transition"
            >
              →
            </button>
          </>
        )}

      </div>

      {images.length > 1 && (
        <div className="flex justify-center gap-3 mt-5">

          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full transition ${
                current === index
                  ? "bg-white"
                  : "bg-zinc-600 hover:bg-zinc-400"
              }`}
            />
          ))}

        </div>
      )}

    </div>
  );
}
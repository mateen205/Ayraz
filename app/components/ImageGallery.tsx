"use client";

import { useState } from "react";
import Image from "next/image";

type Props = {
  images: string[];
  name: string;
};

export default function ImageGallery({ images = [], name }: Props) {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!images.length) {
    return (
      <div className="flex h-[600px] items-center justify-center rounded-2xl bg-zinc-900 text-zinc-500">
        No Images
      </div>
    );
  }

  return (
    <div className="w-full">

      <div className="flex flex-col gap-5 lg:flex-row">

        <div className="order-2 flex gap-3 overflow-x-auto lg:order-1 lg:flex-col">

          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition ${
                selectedImage === index
                  ? "border-white"
                  : "border-zinc-800 hover:border-zinc-500"
              }`}
            >
              <Image
                src={image}
                alt={`${name} ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}

        </div>

        <div className="flex flex-1 items-center justify-center rounded-2xl bg-zinc-900 p-4">

          <Image
            src={images[selectedImage]}
            alt={name}
            width={700}
            height={850}
            priority
            className="max-h-[70vh] w-full object-contain"
          />

        </div>

      </div>

    </div>
  );
}
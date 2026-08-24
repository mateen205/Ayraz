"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const heroSlides = [
  {
    src: "/images/hero-shirt.png",
    alt: "AYRAZ oversized tee",
  },
  {
    src: "/images/shirt-black.png",
    alt: "AYRAZ black oversized tee",
  },
  {
    src: "/images/hero-shirt-3.png",
    alt: "AYRAZ streetwear tee",
  },
];

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((currentSlide) => {
        return (currentSlide + 1) % heroSlides.length;
      });
    }, 3000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black via-[#050505] to-[#0b0b0b]" />

      {/* Very subtle background glow — stays behind the image */}
      <div className="pointer-events-none absolute left-[58%] top-1/2 h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.025] blur-[160px]" />

      {/* Main Hero */}
      <div
        className="
          relative z-10 mx-auto flex min-h-screen w-full max-w-[1600px]
          flex-col px-6 pb-16 pt-24
          sm:px-8
          md:px-12
          lg:flex-row lg:items-center lg:gap-8
          lg:px-16 lg:pb-16 lg:pt-24
        "
      >
        {/* =====================================================
            HERO IMAGE
            MOBILE: FIRST
            DESKTOP: RIGHT
        ===================================================== */}
        <div
          className="
            order-1
            relative z-10
            flex w-full
            items-center justify-center
            lg:order-2
            lg:mt-0
            lg:flex-1
            lg:justify-end
          "
        >
          {/* Background glow only — NOT over the image */}
          <div
            className="
              pointer-events-none absolute
              left-1/2 top-1/2
              h-[360px] w-[360px]
              -translate-x-1/2 -translate-y-1/2
              rounded-full
              bg-white/[0.018]
              blur-[110px]
              sm:h-[520px] sm:w-[520px]
              lg:right-[5%] lg:left-auto
              lg:h-[600px] lg:w-[600px]
              lg:-translate-y-1/2
              lg:translate-x-0
            "
          />

          {/* Slider */}
          <div
            className="
              relative z-10
              w-full max-w-[620px]
              overflow-hidden
              sm:max-w-[700px]
              lg:max-w-[760px]
            "
          >
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{
                transform: `translateX(-${activeSlide * 100}%)`,
              }}
            >
              {heroSlides.map((slide, index) => (
                <div
                  key={slide.src}
                  className="
                    relative
                    flex min-w-full
                    items-center justify-center
                  "
                  aria-hidden={index !== activeSlide}
                >
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    width={760}
                    height={760}
                    priority={index === 0}
                    sizes="
                      (max-width: 640px) 92vw,
                      (max-width: 1024px) 75vw,
                      54vw
                    "
                    className="
                      block
                      h-auto
                      w-[88vw]
                      max-w-[500px]
                      object-contain
                      sm:w-[78vw]
                      sm:max-w-[600px]
                      lg:w-full
                      lg:max-w-[760px]
                    "
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Slider indicators */}
          <div
            className="
              absolute
              bottom-2
              left-1/2
              z-20
              flex
              -translate-x-1/2
              items-center
              gap-2
            "
            aria-label="Hero slides"
          >
            {heroSlides.map((slide, index) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => setActiveSlide(index)}
                aria-label={`Show hero slide ${index + 1}`}
                aria-current={index === activeSlide}
                className={`
                  h-1.5
                  rounded-full
                  transition-all
                  duration-300
                  ${
                    index === activeSlide
                      ? "w-8 bg-white"
                      : "w-2 bg-zinc-600 hover:bg-zinc-300"
                  }
                `}
              />
            ))}
          </div>
        </div>

        {/* =====================================================
            LEFT CONTENT
            MOBILE: SECOND
            DESKTOP: LEFT
        ===================================================== */}
        <div
          className="
            order-2
            relative z-20
            mt-8
            w-full
            lg:order-1
            lg:mt-0
            lg:w-[46%]
            lg:shrink-0
          "
        >
          {/* Eyebrow */}
          <p
            className="
              mb-5
              text-xs
              font-medium
              uppercase
              tracking-[0.45em]
              text-[#b49a70]
              sm:text-sm
            "
          >
            AYRAZ STUDIO
          </p>

          {/* Heading */}
          <h1
            className="
              max-w-[650px]
              text-[52px]
              font-black
              uppercase
              leading-[0.88]
              tracking-[-0.04em]
              sm:text-[68px]
              md:text-[78px]
              lg:text-[82px]
              xl:text-[94px]
            "
          >
            OWN THE
            <br />
            STREET.
          </h1>

          {/* Description */}
          <p
            className="
              mt-7
              max-w-[510px]
              text-sm
              leading-7
              text-zinc-400
              sm:mt-8
              sm:text-base
              sm:leading-8
            "
          >
            Premium oversized streetwear crafted for those who define their
            own identity.
          </p>

          {/* Shop Button */}
          <div className="mt-7 sm:mt-8">
            <Link
              href="/#drops"
              className="
                inline-flex
                h-14
                w-full
                items-center
                justify-center
                gap-3
                rounded-sm
                bg-white
                px-8
                text-xs
                font-semibold
                uppercase
                tracking-[0.25em]
                text-black
                transition-all
                duration-300
                hover:bg-zinc-200
                sm:w-auto
              "
            >
              SHOP COLLECTION
              <span className="text-base">→</span>
            </Link>
          </div>

          {/* =====================================================
              FEATURE HIGHLIGHTS
          ===================================================== */}
          <div
            className="
              mt-9
              grid
              max-w-[620px]
              grid-cols-1
              gap-0
              border-t
              border-zinc-800
              pt-2
              sm:mt-10
              sm:grid-cols-3
              sm:gap-4
              sm:pt-7
            "
          >
            {/* Premium Quality */}
            <div
              className="
                flex
                items-center
                gap-4
                border-b
                border-zinc-800
                py-5
                sm:block
                sm:border-0
                sm:py-0
              "
            >
              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-zinc-700
                  text-lg
                "
              >
                ♧
              </div>

              <div className="sm:mt-4">
                <p
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.18em]
                    text-white
                  "
                >
                  PREMIUM QUALITY
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  Built to last
                </p>
              </div>
            </div>

            {/* Limited Drops */}
            <div
              className="
                flex
                items-center
                gap-4
                border-b
                border-zinc-800
                py-5
                sm:block
                sm:border-0
                sm:py-0
              "
            >
              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-zinc-700
                  text-lg
                "
              >
                ◇
              </div>

              <div className="sm:mt-4">
                <p
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.18em]
                    text-white
                  "
                >
                  LIMITED DROPS
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  Exclusively designed
                </p>
              </div>
            </div>

            {/* Made For The Culture */}
            <div
              className="
                flex
                items-center
                gap-4
                py-5
                sm:block
                sm:py-0
              "
            >
              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-zinc-700
                  text-lg
                "
              >
                ◎
              </div>

              <div className="sm:mt-4">
                <p
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.18em]
                    text-white
                  "
                >
                  MADE FOR THE CULTURE
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  Worldwide streetwear
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator — desktop only */}
      <div
        className="
          absolute
          bottom-6
          left-1/2
          hidden
          -translate-x-1/2
          items-center
          gap-4
          text-[10px]
          uppercase
          tracking-[0.35em]
          text-zinc-500
          lg:flex
        "
      >
        <span className="h-8 w-px bg-zinc-700" />
        <span>SCROLL TO EXPLORE</span>
      </div>
    </section>
  );
}
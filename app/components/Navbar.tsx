"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, User } from "lucide-react";

import WhatsappButton from "./WhatsappButton";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
  const [cartOpen, setCartOpen] = useState(false);
  const router = useRouter();

  function goToSection(section: string) {
    if (window.location.pathname === "/") {
      const element = document.getElementById(section);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
        });
      }
    } else {
     window.location.href = `/#${section}`;
    }
  }

  return (
    <>
      <header className="fixed top-0 left-0 z-50 w-full border-b border-white/5 bg-black/30 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-4 sm:px-6 md:px-14">

          {/* LEFT */}

          <nav className="hidden md:flex items-center gap-14 uppercase tracking-[0.35em] text-xs text-zinc-400">

           <button
  onClick={() => goToSection("drops")}
  className="uppercase tracking-[0.35em] text-xs font-normal text-zinc-400 transition hover:text-white"
>
  Shop
</button>

<button
  onClick={() => goToSection("about")}
  className="uppercase tracking-[0.35em] text-xs font-normal text-zinc-400 transition hover:text-white"
>
  About
</button>

          </nav>

          {/* CENTER */}

          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2"
          >
            <h1 className="text-2xl font-semibold tracking-[0.45em]">
              AYRAZ
            </h1>
          </Link>

          {/* RIGHT */}

          <div className="flex items-center gap-7">

            <Link href="/login">
              <User
                size={23}
                className="cursor-pointer text-zinc-300 transition hover:text-white"
              />
            </Link>

            <button
              onClick={() => setCartOpen(true)}
              className="cursor-pointer"
            >
              <ShoppingBag
                size={23}
                className="text-zinc-300 transition hover:text-white"
              />
            </button>

            <div className="h-10 w-px bg-white/10" />

            <Link
              href="/"
              className="ml-40 md:ml-0"
            >
              <Image
                src="/images/stitched-logo.png"
                alt="AYRAZ"
                width={40}
                height={40}
                className="h-10 w-10 md:h-12 md:w-12 opacity-90 transition hover:opacity-100"
              />
            </Link>

          </div>

        </div>
      </header>

            <WhatsappButton cartOpen={cartOpen} />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
      />
    </>
  );
}
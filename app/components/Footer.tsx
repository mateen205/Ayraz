import { FaInstagram, FaFacebookF } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-zinc-800 py-14 px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">

        {/* Brand */}
        <div>
          <h2 className="text-white text-2xl font-bold tracking-[0.3em]">
            AYRAZ
          </h2>

          <p className="mt-3 text-zinc-500">
            Premium Pakistani Streetwear.
          </p>
        </div>

        {/* Socials */}
        <div className="flex items-center gap-6">

          <a
            href="https://www.instagram.com/theayraz.co"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 transition duration-300 hover:text-white hover:scale-110"
          >
            <FaInstagram size={22} />
          </a>

          <a
            href="https://www.facebook.com/share/1bJcZ88fLr/?mibextid=wwXIfr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 transition duration-300 hover:text-white hover:scale-110"
          >
            <FaFacebookF size={22} />
          </a>

        </div>

      </div>

      <div className="mt-10 border-t border-zinc-800 pt-6 text-center text-sm text-zinc-600">
        © 2026 AYRAZ. All rights reserved.
      </div>
    </footer>
  );
}
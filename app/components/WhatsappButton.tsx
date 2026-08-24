"use client";

import { MessageCircle } from "lucide-react";

interface WhatsappButtonProps {
  cartOpen: boolean;
}

export default function WhatsappButton({
  cartOpen,
}: WhatsappButtonProps) {
  return (
    <a
      href="https://api.whatsapp.com/send?phone=923197001274&text=Hi%20AYRAZ!%20I%20need%20some%20help."
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-8 right-8 z-[100] transition-transform duration-500 ease-in-out ${
        cartOpen ? "-translate-x-[480px]" : "translate-x-0"
      }`}
    >
      <div className="flex items-center gap-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 px-5 py-3 shadow-2xl hover:bg-[#25D366] transition-all duration-300">
        <MessageCircle size={24} className="text-white" />

        <span className="hidden md:block text-sm tracking-wider text-white">
          Customer Care
        </span>
      </div>
    </a>
  );
}
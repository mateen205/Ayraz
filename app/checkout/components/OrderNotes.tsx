"use client";

import { StickyNote } from "lucide-react";

interface OrderNotesProps {
  notes: string;
  setNotes: React.Dispatch<React.SetStateAction<string>>;
}

export default function OrderNotes({
  notes,
  setNotes,
}: OrderNotesProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-[#111111] p-6 md:p-8">

      <div className="flex items-center gap-3 mb-6">

        <StickyNote size={22} />

        <h2 className="text-2xl font-semibold">
          Order Notes
        </h2>

      </div>

      <textarea
        rows={5}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Leave delivery instructions..."
        className="w-full rounded-2xl border border-white/10 bg-black/40 px-5 py-4 resize-none outline-none transition focus:border-white"
      />

      <p className="mt-3 text-sm text-zinc-500">
        Optional. Tell us anything that will help deliver your order.
      </p>

    </section>
  );
}

"use client";

type Props = {
  label: string;
  value: string;
  onUpload: (path: string) => void;
};

export default function ImageUploader({
  label,
  value,
  onUpload,
}: Props) {
  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        onUpload(data.path);
      } else {
        alert(data.message || "Upload failed.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed.");
    }
  }

  return (
    <div className="space-y-3">
      <label className="block font-semibold">
        {label}
      </label>

      {value ? (
        <img
          src={value}
          alt={label}
          width={220}
          height={220}
          className="rounded-xl border border-zinc-700 object-cover"
        />
      ) : (
        <div className="flex h-[220px] w-[220px] items-center justify-center rounded-xl border border-dashed border-zinc-700 text-zinc-500">
          No Image
        </div>
      )}

      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={upload}
        className="block w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-white file:px-4 file:py-2 file:text-black hover:file:bg-zinc-200"
      />
    </div>
  );
}

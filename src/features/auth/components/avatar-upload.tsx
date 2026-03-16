import { useRef } from "react";

import { Upload } from "lucide-react";

interface AvatarUploadProps {
  preview: string | null;
  onChange: (file: File, previewUrl: string) => void;
  label?: string;
  size?: "sm" | "md";
}

export default function AvatarUpload({
  preview,
  onChange,
  label = "Upload avatar (optional)",
  size = "md",
}: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dimension = size === "sm" ? "size-20" : "size-24";

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => onChange(file, reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className={`group relative ${dimension} border-border/60 hover:border-primary/50 bg-muted/30 flex cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed transition-colors`}
      >
        {preview ? (
          <img
            src={preview}
            alt="Avatar preview"
            className="size-full object-cover"
          />
        ) : (
          <Upload className="text-muted-foreground group-hover:text-primary size-5 transition-colors" />
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <Upload className="size-5 text-white" />
        </div>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
      <span className="text-muted-foreground text-xs">{label}</span>
    </div>
  );
}

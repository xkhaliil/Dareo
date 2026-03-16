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
        className={`group relative ${dimension} rounded-full border-2 border-dashed border-border/60 hover:border-primary/50 bg-muted/30 flex items-center justify-center overflow-hidden transition-colors cursor-pointer`}
      >
        {preview ? (
          <img src={preview} alt="Avatar preview" className="size-full object-cover" />
        ) : (
          <Upload className="size-5 text-muted-foreground group-hover:text-primary transition-colors" />
        )}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
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
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

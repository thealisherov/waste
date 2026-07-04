"use client";

import { useState } from "react";
import { UploadCloud, Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";

interface ImageUploaderProps {
  onUpload: (base64: string) => void;
  loading: boolean;
}

export function ImageUploader({ onUpload, loading }: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const { t } = useLanguage();

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert(t("scan.failed") + ": image format required");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result && typeof reader.result === "string") {
        setPreview(reader.result);
        const base64 = reader.result.split(",")[1];
        onUpload(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const clearPreview = () => {
    setPreview(null);
  };

  return (
    <Card className="border-zinc-800 bg-zinc-950/70 backdrop-blur-xl shadow-2xl overflow-hidden p-4 sm:p-6">
      {preview ? (
        <div className="relative aspect-[4/3] w-full bg-zinc-900 rounded-xl overflow-hidden group">
          <img
            src={preview}
            alt="Waste Preview"
            className="w-full h-full object-contain"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button
              variant="destructive"
              size="icon"
              onClick={clearPreview}
              disabled={loading}
              className="rounded-full shadow-lg"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {loading && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-xs sm:text-sm text-emerald-400 font-medium">{t("profile.loading")}</p>
            </div>
          )}
        </div>
      ) : (
        <label
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          htmlFor="dropzone-file"
          className={`flex flex-col items-center justify-center aspect-[4/3] w-full border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 ${
            dragActive
              ? "border-emerald-500 bg-emerald-500/10"
              : "border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/50"
          }`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
            <div className="p-3 bg-zinc-900 rounded-full border border-zinc-800 mb-3 group-hover:scale-110 transition-transform duration-300">
              <UploadCloud className="w-6 h-6 sm:w-8 sm:h-8 text-zinc-400" />
            </div>
            <p className="mb-1 text-xs sm:text-sm text-zinc-200 font-semibold leading-relaxed">
              {t("scan.upload_file_title")}
            </p>
            <p className="text-[10px] sm:text-xs text-zinc-500 mb-3">
              {t("scan.upload_file_sub")}
            </p>
            <Button
              variant="secondary"
              size="sm"
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 pointer-events-none text-[10px] sm:text-xs"
            >
              {t("scan.browse_files")}
            </Button>
          </div>
          <input
            id="dropzone-file"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleChange}
            disabled={loading}
          />
        </label>
      )}
    </Card>
  );
}

"use client";

import { Leaf } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";

export function MobileHeader() {
  const { language, setLanguage } = useLanguage();

  return (
    <header className="md:hidden border-b border-zinc-900 bg-zinc-950/80 backdrop-blur sticky top-0 z-20 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Leaf className="h-5 w-5 text-emerald-400" />
        <span className="font-extrabold text-lg tracking-tight text-white">
          EcoWaste <span className="text-emerald-400">UZ</span>
        </span>
      </div>

      <div className="flex items-center bg-zinc-900 border border-zinc-850 rounded-lg p-0.5">
        <Button
          onClick={() => setLanguage("uz")}
          size="sm"
          className={`h-6 px-2 text-[9px] font-extrabold rounded-md ${
            language === "uz" ? "bg-emerald-500 text-white" : "bg-transparent text-zinc-400 hover:text-white"
          }`}
        >
          UZ
        </Button>
        <Button
          onClick={() => setLanguage("en")}
          size="sm"
          className={`h-6 px-2 text-[9px] font-extrabold rounded-md ${
            language === "en" ? "bg-emerald-500 text-white" : "bg-transparent text-zinc-400 hover:text-white"
          }`}
        >
          EN
        </Button>
      </div>
    </header>
  );
}

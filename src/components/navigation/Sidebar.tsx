"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Camera, History, User, Leaf, Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    {
      label: t("nav.scan"),
      href: "/scan",
      icon: Camera,
    },
    {
      label: t("nav.history"),
      href: "/history",
      icon: History,
    },
    {
      label: t("nav.profile"),
      href: "/profile",
      icon: User,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-zinc-900/50 border-r border-zinc-800/80 backdrop-blur-xl hidden md:flex flex-col p-6 z-30">
      <div className="flex items-center gap-2 mb-8">
        <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
          <Leaf className="h-6 w-6" />
        </div>
        <span className="font-extrabold text-xl text-white tracking-tight">
          EcoWaste <span className="text-emerald-400">UZ</span>
        </span>
      </div>

      <nav className="flex-1 flex flex-col gap-1.5">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href === "/scan" && pathname === "/");
          return (
            <Link
              key={idx}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group ${
                isActive
                  ? "text-white bg-zinc-800/80 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] border border-zinc-700/50"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-850/50 border border-transparent"
              }`}
            >
              <Icon
                className={`h-5 w-5 transition-colors ${
                  isActive ? "text-emerald-400" : "text-zinc-400 group-hover:text-emerald-400"
                }`}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Language Switcher inside Sidebar footer */}
      <div className="mt-auto pt-4 border-t border-zinc-800 space-y-4">
        <div className="flex items-center justify-between bg-zinc-950/60 border border-zinc-800/60 rounded-xl p-1">
          <Button
            onClick={() => setLanguage("uz")}
            className={`flex-1 h-7 text-[10px] font-bold rounded-lg ${
              language === "uz" ? "bg-emerald-500 text-white" : "bg-transparent text-zinc-400 hover:text-white"
            }`}
          >
            UZ
          </Button>
          <Button
            onClick={() => setLanguage("en")}
            className={`flex-1 h-7 text-[10px] font-bold rounded-lg ${
              language === "en" ? "bg-emerald-500 text-white" : "bg-transparent text-zinc-400 hover:text-white"
            }`}
          >
            EN
          </Button>
        </div>
        <div className="text-[10px] text-zinc-500 text-center">
          EcoWaste UZ © {new Date().getFullYear()}
        </div>
      </div>
    </aside>
  );
}

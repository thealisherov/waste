"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Camera, History, User } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

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
    <nav className="md:hidden fixed bottom-4 left-4 right-4 bg-zinc-900/80 border border-zinc-800/60 backdrop-blur-xl rounded-2xl p-1.5 flex justify-around items-center shadow-2xl z-30">
      {navItems.map((item, idx) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href === "/scan" && pathname === "/");
        return (
          <Link
            key={idx}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 py-1.5 px-5 rounded-xl text-[10px] font-bold transition-all duration-300 ${
              isActive ? "text-emerald-400" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Camera, History, User, Leaf } from "lucide-react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default async function MainLayout({ children }: MainLayoutProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Navigation items definition
  const navItems = [
    {
      label: "Scan",
      href: "/",
      icon: Camera,
    },
    {
      label: "History",
      href: "/history",
      icon: History,
    },
    {
      label: "Profile",
      href: "/profile",
      icon: User,
    },
  ];

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-zinc-950 pb-20 md:pb-0 md:pl-64">
      {/* Sidebar navigation for desktop */}
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
            return (
              <Link
                key={idx}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all duration-300 group"
              >
                <Icon className="h-5 w-5 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-zinc-800 text-[10px] text-zinc-500 text-center">
          EcoWaste UZ © {new Date().getFullYear()}
        </div>
      </aside>

      {/* Top Header for Mobile */}
      <header className="md:hidden border-b border-zinc-900 bg-zinc-950/80 backdrop-blur sticky top-0 z-20 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-emerald-400" />
          <span className="font-extrabold text-lg tracking-tight text-white">
            EcoWaste <span className="text-emerald-400">UZ</span>
          </span>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4 sm:p-6 md:p-8">
        {children}
      </main>

      {/* Bottom Floating Nav Bar for Mobile */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 bg-zinc-900/70 border border-zinc-800/60 backdrop-blur-xl rounded-2xl p-2 flex justify-around items-center shadow-2xl z-30">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Link
              key={idx}
              href={item.href}
              className="flex flex-col items-center gap-1 py-1.5 px-4 rounded-xl text-xs font-bold text-zinc-400 hover:text-emerald-400 transition-colors"
            >
              <Icon className="h-5.5 w-5.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

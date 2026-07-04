import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/navigation/Sidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { MobileHeader } from "@/components/navigation/MobileHeader";

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

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-zinc-950 pb-24 md:pb-0 md:pl-64">
      {/* Sidebar for Desktop */}
      <Sidebar />

      {/* Top Header for Mobile */}
      <MobileHeader />

      {/* Main Content Viewport */}
      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4 sm:p-6 md:p-8">
        {children}
      </main>

      {/* Bottom Floating Nav Bar for Mobile */}
      <BottomNav />
    </div>
  );
}

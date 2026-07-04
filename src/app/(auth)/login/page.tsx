"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Leaf, Sparkles, Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/callback`,
        },
      });
      if (error) throw error;
    } catch (err) {
      console.error("Auth error:", err);
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-zinc-950 px-4 overflow-hidden">
      {/* Language Switcher in top corner */}
      <div className="absolute top-4 right-4 z-30 flex items-center gap-1 bg-zinc-900/60 border border-zinc-800 rounded-full p-1">
        <Button
          onClick={() => setLanguage("uz")}
          variant={language === "uz" ? "default" : "ghost"}
          size="sm"
          className={`h-7 px-3 text-[10px] font-bold rounded-full ${
            language === "uz" ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "text-zinc-400 hover:text-white"
          }`}
        >
          UZB
        </Button>
        <Button
          onClick={() => setLanguage("en")}
          variant={language === "en" ? "default" : "ghost"}
          size="sm"
          className={`h-7 px-3 text-[10px] font-bold rounded-full ${
            language === "en" ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "text-zinc-400 hover:text-white"
          }`}
        >
          ENG
        </Button>
      </div>

      {/* Decorative Blur Blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>

      <Card className="max-w-md w-full border-zinc-800 bg-zinc-900/40 backdrop-blur-2xl shadow-2xl relative overflow-hidden p-2">
        {/* Glow Top Border */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500"></div>

        <CardHeader className="text-center pt-8">
          <div className="mx-auto p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl w-fit text-emerald-400 mb-4 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <Leaf className="h-8 w-8 animate-bounce-slow" />
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight text-white flex justify-center items-center gap-1.5">
            EcoWaste <span className="text-emerald-400">UZ</span>
          </CardTitle>
          <CardDescription className="text-zinc-400 mt-2 max-w-xs mx-auto text-sm">
            {t("login.description")}
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-8 pt-2 flex flex-col gap-6">
          <div className="space-y-4">
            <div className="bg-zinc-950/50 border border-zinc-800/80 rounded-xl p-4 flex gap-3">
              <Sparkles className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed text-zinc-300">
                {t("login.instructions")}
              </p>
            </div>
          </div>

          <Button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-6 bg-white hover:bg-zinc-100 text-zinc-950 font-bold transition-all duration-300 flex items-center justify-center gap-3 rounded-xl border border-zinc-200 shadow-[0_4px_20px_rgba(255,255,255,0.05)]"
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  fill="#EA4335"
                />
              </svg>
            )}
            {t("login.google_button")}
          </Button>

          <p className="text-[10px] text-center text-zinc-500 max-w-[240px] mx-auto leading-relaxed">
            {t("login.footer")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

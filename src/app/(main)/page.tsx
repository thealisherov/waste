"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useUserProfile, useScanHistory } from "@/lib/queries/scans";
import { EcoScoreCard } from "@/components/profile/EcoScoreCard";
import { HistoryListItem } from "@/components/history/HistoryListItem";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, ImageUp, Sparkles, ArrowRight, Leaf } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/context/LanguageContext";

export default function HomePage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    fetchUser();
  }, []);

  const { data: profile, isLoading: profileLoading } = useUserProfile(userId || "");
  const { data: scans, isLoading: scansLoading } = useScanHistory(userId || "");

  const recentScans = scans?.slice(0, 3) || [];

  return (
    <div className="space-y-6 md:space-y-8 max-w-full overflow-hidden">
      {/* Welcome Title */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center flex-wrap gap-2">
          <span>{t("home.hello")},</span>
          {profileLoading ? (
            <Skeleton className="h-8 w-32 bg-zinc-800 rounded-lg" />
          ) : (
            <span className="text-emerald-400 truncate max-w-[200px] sm:max-w-xs">{profile?.full_name || "Eco Friend"}</span>
          )}
          <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-400 shrink-0" />
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm">
          {t("home.subtitle")}
        </p>
      </div>

      {/* Eco Score Card */}
      {profileLoading ? (
        <Card className="border-zinc-855 bg-zinc-950/60 p-6 space-y-4">
          <Skeleton className="h-6 w-32 bg-zinc-850" />
          <Skeleton className="h-10 w-48 bg-zinc-850" />
          <Skeleton className="h-4 w-full bg-zinc-850" />
        </Card>
      ) : (
        profile && (
          <EcoScoreCard
            ecoScore={profile.eco_score}
            level={profile.level}
            userName={profile.full_name}
          />
        )
      )}

      {/* Scan CTA Dashboard Block */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/50 hover:border-emerald-500/30 transition-all duration-300 overflow-hidden relative group">
          <CardContent className="p-5 sm:p-6 flex flex-col justify-between h-44 sm:h-48">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl w-fit">
              <Camera className="h-5.5 w-5.5" />
            </div>
            <div className="space-y-1 my-2">
              <h3 className="text-base sm:text-lg font-bold text-white">{t("home.camera_title")}</h3>
              <p className="text-[11px] sm:text-xs text-zinc-400 line-clamp-2">{t("home.camera_desc")}</p>
            </div>
            <Button
              onClick={() => router.push("/scan?method=camera")}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold flex items-center justify-center gap-2 rounded-xl text-xs sm:text-sm py-5"
            >
              {t("home.camera_btn")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/50 hover:border-teal-500/30 transition-all duration-300 overflow-hidden relative group">
          <CardContent className="p-5 sm:p-6 flex flex-col justify-between h-44 sm:h-48">
            <div className="p-2.5 bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded-xl w-fit">
              <ImageUp className="h-5.5 w-5.5" />
            </div>
            <div className="space-y-1 my-2">
              <h3 className="text-base sm:text-lg font-bold text-white">{t("home.upload_title")}</h3>
              <p className="text-[11px] sm:text-xs text-zinc-400 line-clamp-2">{t("home.upload_desc")}</p>
            </div>
            <Button
              onClick={() => router.push("/scan?method=upload")}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold flex items-center justify-center gap-2 rounded-xl text-xs sm:text-sm py-5"
            >
              {t("home.upload_btn")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Scans Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Leaf className="h-5 w-5 text-emerald-400 shrink-0" />
            {t("home.recent_scans")}
          </h2>
          {scans && scans.length > 3 && (
            <Link
              href="/history"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 hover:underline"
            >
              {t("home.see_all")}
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>

        {scansLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-20 w-full bg-zinc-900/50 rounded-xl animate-pulse" />
            <Skeleton className="h-20 w-full bg-zinc-900/50 rounded-xl animate-pulse" />
          </div>
        ) : recentScans.length > 0 ? (
          <div className="flex flex-col gap-3">
            {recentScans.map((scan: any) => (
              <HistoryListItem key={scan.id} scan={scan} />
            ))}
          </div>
        ) : (
          <Card className="border-zinc-800 bg-zinc-950/40 p-8 text-center border-dashed">
            <p className="text-zinc-500 text-xs sm:text-sm">{t("home.no_scans")}</p>
          </Card>
        )}
      </div>
    </div>
  );
}

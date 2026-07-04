"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useUserProfile, useUserStats } from "@/lib/queries/scans";
import { EcoScoreCard } from "@/components/profile/EcoScoreCard";
import { StatsGrid } from "@/components/profile/StatsGrid";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut, User, Mail, Sparkles, BarChart2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from "@/context/LanguageContext";

export default function ProfilePage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        setUserEmail(user.email || null);
      }
    };
    fetchUser();
  }, []);

  const { data: profile, isLoading: profileLoading } = useUserProfile(userId || "");
  const { data: stats, isLoading: statsLoading } = useUserStats(userId || "");

  const handleSignOut = async () => {
    setLogoutLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.refresh();
      router.push("/login");
    } catch (err) {
      console.error("Sign out error:", err);
      setLogoutLoading(false);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 max-w-full overflow-hidden">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-zinc-900/30 border border-zinc-850 p-5 sm:p-6 rounded-2xl">
        {profileLoading ? (
          <Skeleton className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-zinc-800" />
        ) : (
          <Avatar className="h-14 w-14 sm:h-16 sm:w-16 border-2 border-emerald-500/20 shadow-lg shrink-0">
            {profile?.avatar_url && <AvatarImage src={profile.avatar_url} />}
            <AvatarFallback className="bg-zinc-800 text-zinc-350 font-bold">
              {profile?.full_name?.slice(0, 2).toUpperCase() || "EC"}
            </AvatarFallback>
          </Avatar>
        )}

        <div className="flex-1 text-center sm:text-left min-w-0 space-y-1">
          {profileLoading ? (
            <>
              <Skeleton className="h-5 w-36 bg-zinc-800 mx-auto sm:mx-0" />
              <Skeleton className="h-4 w-44 bg-zinc-800 mx-auto sm:mx-0" />
            </>
          ) : (
            <>
              <h2 className="text-lg sm:text-xl font-extrabold text-white truncate flex items-center justify-center sm:justify-start gap-1.5">
                {profile?.full_name || "Eco Friend"}
                <Sparkles className="h-4 w-4 text-emerald-400 shrink-0" />
              </h2>
              <p className="text-xs text-zinc-400 flex items-center justify-center sm:justify-start gap-1.5 truncate">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{userEmail || t("profile.loading")}</span>
              </p>
            </>
          )}
        </div>

        <Button
          onClick={handleSignOut}
          disabled={logoutLoading}
          variant="outline"
          className="w-full sm:w-auto border-zinc-800 bg-zinc-950 text-red-400 hover:bg-red-950/20 hover:text-red-300 rounded-xl py-5"
        >
          <LogOut className="mr-2 h-4 w-4 shrink-0" />
          {logoutLoading ? t("profile.signing_out") : t("profile.sign_out")}
        </Button>
      </div>

      {/* Score and Level block */}
      {profileLoading ? (
        <Card className="border-zinc-800 bg-zinc-950/60 p-6 space-y-4">
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

      {/* Statistics Section */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-emerald-400 shrink-0" />
          {t("profile.stats_title")}
        </h2>

        {statsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Skeleton className="h-28 w-full bg-zinc-800 rounded-xl" />
            <Skeleton className="h-28 w-full bg-zinc-800 rounded-xl" />
            <Skeleton className="h-28 w-full bg-zinc-800 rounded-xl" />
          </div>
        ) : (
          stats && <StatsGrid stats={stats} />
        )}
      </div>
    </div>
  );
}

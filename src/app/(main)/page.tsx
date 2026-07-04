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

export default function HomePage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

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
    <div className="space-y-8">
      {/* Welcome Title */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl flex items-center gap-2">
          Hello, {profileLoading ? <Skeleton className="h-8 w-32 bg-zinc-800" /> : profile?.full_name || "Eco Friend"}!
          <Sparkles className="h-6 w-6 text-emerald-400" />
        </h1>
        <p className="text-zinc-400 text-sm">
          Let's sort your waste and earn Eco Points today.
        </p>
      </div>

      {/* Eco Score Card */}
      {profileLoading ? (
        <Card className="border-zinc-800 bg-zinc-950/60 p-6 space-y-4">
          <Skeleton className="h-6 w-32 bg-zinc-800" />
          <Skeleton className="h-10 w-48 bg-zinc-800" />
          <Skeleton className="h-4 w-full bg-zinc-800" />
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
          <CardContent className="p-6 flex flex-col justify-between h-48">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl w-fit">
              <Camera className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Scan with Camera</h3>
              <p className="text-xs text-zinc-400">Use your camera to classify waste instantly.</p>
            </div>
            <Button
              onClick={() => router.push("/scan?method=camera")}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold flex items-center justify-center gap-2 rounded-xl"
            >
              Open Camera
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/50 hover:border-teal-500/30 transition-all duration-300 overflow-hidden relative group">
          <CardContent className="p-6 flex flex-col justify-between h-48">
            <div className="p-3 bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded-xl w-fit">
              <ImageUp className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">Upload from Gallery</h3>
              <p className="text-xs text-zinc-400">Upload a saved image for AI categorization.</p>
            </div>
            <Button
              onClick={() => router.push("/scan?method=upload")}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold flex items-center justify-center gap-2 rounded-xl"
            >
              Choose Image
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Scans Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Leaf className="h-5 w-5 text-emerald-400" />
            Recent Scans
          </h2>
          {scans && scans.length > 3 && (
            <Link
              href="/history"
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 hover:underline"
            >
              See all history
              <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>

        {scansLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-20 w-full bg-zinc-800 rounded-xl" />
            <Skeleton className="h-20 w-full bg-zinc-800 rounded-xl" />
          </div>
        ) : recentScans.length > 0 ? (
          <div className="flex flex-col gap-3">
            {recentScans.map((scan) => (
              <HistoryListItem key={scan.id} scan={scan} />
            ))}
          </div>
        ) : (
          <Card className="border-zinc-800 bg-zinc-950/40 p-8 text-center border-dashed">
            <p className="text-zinc-500 text-sm">No items scanned yet. Start scanning now!</p>
          </Card>
        )}
      </div>
    </div>
  );
}

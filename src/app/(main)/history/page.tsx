"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useScanHistory } from "@/lib/queries/scans";
import { HistoryListItem } from "@/components/history/HistoryListItem";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { History, Leaf } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function HistoryPage() {
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

  const { data: scans, isLoading } = useScanHistory(userId || "");

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <History className="h-6 w-6 sm:h-7 sm:w-7 text-emerald-400 shrink-0" />
          {t("nav.history")}
        </h1>
        <p className="text-zinc-400 text-xs sm:text-sm mt-1">
          {t("scan.result_subtitle")}
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full bg-zinc-900/50 rounded-xl" />
          <Skeleton className="h-20 w-full bg-zinc-900/50 rounded-xl" />
          <Skeleton className="h-20 w-full bg-zinc-900/50 rounded-xl" />
        </div>
      ) : scans && scans.length > 0 ? (
        <div className="flex flex-col gap-3">
          {scans.map((scan: any) => (
            <HistoryListItem key={scan.id} scan={scan} />
          ))}
        </div>
      ) : (
        <Card className="border-zinc-800 bg-zinc-950/40 p-12 text-center border-dashed">
          <div className="mx-auto p-3 bg-zinc-900 border border-zinc-800 rounded-full w-fit mb-4 text-zinc-500">
            <Leaf className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-300 mb-1">{t("home.no_scans")}</h3>
        </Card>
      )}
    </div>
  );
}

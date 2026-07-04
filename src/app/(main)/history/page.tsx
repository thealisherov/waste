"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useScanHistory } from "@/lib/queries/scans";
import { HistoryListItem } from "@/components/history/HistoryListItem";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { History, Leaf } from "lucide-react";

export default function HistoryPage() {
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

  const { data: scans, isLoading } = useScanHistory(userId || "");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <History className="h-7 w-7 text-emerald-400" />
          Scan History
        </h1>
        <p className="text-zinc-400 text-sm">
          A list of all your previously classified waste materials.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full bg-zinc-905" />
          <Skeleton className="h-20 w-full bg-zinc-905" />
          <Skeleton className="h-20 w-full bg-zinc-905" />
          <Skeleton className="h-20 w-full bg-zinc-905" />
        </div>
      ) : scans && scans.length > 0 ? (
        <div className="flex flex-col gap-3">
          {scans.map((scan) => (
            <HistoryListItem key={scan.id} scan={scan} />
          ))}
        </div>
      ) : (
        <Card className="border-zinc-800 bg-zinc-950/40 p-12 text-center border-dashed">
          <div className="mx-auto p-3 bg-zinc-900 border border-zinc-800 rounded-full w-fit mb-4 text-zinc-500">
            <Leaf className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-300 mb-1">No items scanned yet</h3>
          <p className="text-xs text-zinc-500 max-w-xs mx-auto mb-4">
            Items you scan or upload will be securely recorded here with full AI recycling details.
          </p>
        </Card>
      )}
    </div>
  );
}

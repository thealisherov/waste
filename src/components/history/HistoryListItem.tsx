"use client";

import { format } from "date-fns";
import { Recycle, Trash2, Calendar, ChevronRight, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScanResultCard } from "@/components/scan/ScanResultCard";
import { WasteAnalysisResult } from "@/types/scan";

interface HistoryListItemProps {
  scan: {
    id: string;
    image_url: string;
    item_name: string;
    category: string;
    material: string;
    recyclable: boolean;
    confidence: number;
    decomposition_time: string;
    disposal_bin: string;
    not_to_do: string[];
    environmental_impact: string;
    fun_fact: string;
    advice: string;
    summary: string;
    created_at: string;
  };
}

export function HistoryListItem({ scan }: HistoryListItemProps) {
  const formattedDate = format(new Date(scan.created_at), "MMM d, yyyy • HH:mm");

  // Cast scan to WasteAnalysisResult
  const wasteResult: WasteAnalysisResult = {
    item_name: scan.item_name,
    category: scan.category,
    material: scan.material,
    recyclable: scan.recyclable,
    confidence: Number(scan.confidence),
    decomposition_time: scan.decomposition_time,
    disposal_bin: scan.disposal_bin,
    not_to_do: scan.not_to_do,
    environmental_impact: scan.environmental_impact,
    fun_fact: scan.fun_fact,
    advice: scan.advice,
    summary: scan.summary,
  };

  return (
    <Dialog>
      <DialogTrigger
        render={
          <div className="border border-zinc-800 bg-zinc-950/40 hover:bg-zinc-900/40 hover:border-zinc-700/60 transition-all duration-300 cursor-pointer overflow-hidden p-4 flex gap-4 items-center group rounded-xl" />
        }
      >
        {/* Image Thumbnail */}
        <div className="h-16 w-16 rounded-lg overflow-hidden bg-zinc-900 flex-shrink-0 relative">
          <img
            src={scan.image_url}
            alt={scan.item_name}
            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {scan.recyclable ? (
            <div className="absolute top-1 right-1 bg-emerald-500/90 text-white p-0.5 rounded-full">
              <Recycle className="h-3 w-3" />
            </div>
          ) : (
            <div className="absolute top-1 right-1 bg-red-500/90 text-white p-0.5 rounded-full">
              <Trash2 className="h-3 w-3" />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className="text-sm font-semibold text-zinc-150 truncate group-hover:text-emerald-400 transition-colors">
              {scan.item_name}
            </h4>
            <Badge
              variant="outline"
              className="text-[10px] py-0 px-1.5 border-zinc-800 text-zinc-400 bg-zinc-900/50"
            >
              {scan.category}
            </Badge>
          </div>
          
          <p className="text-xs text-zinc-400 truncate mb-1">
            Material: <span className="text-zinc-300">{scan.material}</span>
          </p>

          <div className="flex items-center gap-1 text-[10px] text-zinc-500">
            <Calendar className="h-3 w-3" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Arrow / Hover Eye */}
        <div className="text-zinc-500 group-hover:text-zinc-300 pl-2">
          <ChevronRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-3xl bg-zinc-950 border-zinc-800 overflow-y-auto max-h-[90vh] p-4 sm:p-6 text-zinc-100">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            Scan Details
          </DialogTitle>
        </DialogHeader>
        <ScanResultCard result={wasteResult} imageUrl={scan.image_url} />
      </DialogContent>
    </Dialog>
  );
}

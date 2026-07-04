"use client";

import { Check, X, ShieldAlert, Sparkles, HelpCircle, Leaf, Recycle, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AdviceBox } from "./AdviceBox";
import { WasteAnalysisResult } from "@/types/scan";

interface ScanResultCardProps {
  result: WasteAnalysisResult;
  imageUrl?: string;
}

export function ScanResultCard({ result, imageUrl }: ScanResultCardProps) {
  const {
    item_name,
    category,
    material,
    recyclable,
    confidence,
    decomposition_time,
    disposal_bin,
    not_to_do,
    environmental_impact,
    fun_fact,
    advice,
    summary,
  } = result;

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
      <Card className="border-zinc-800 bg-zinc-950/60 backdrop-blur-xl shadow-2xl overflow-hidden">
        {imageUrl && (
          <div className="w-full aspect-[16/9] relative overflow-hidden bg-black/40">
            <img
              src={imageUrl}
              alt={item_name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div>
                <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium mb-1">
                  {category}
                </Badge>
                <h2 className="text-2xl font-bold text-white tracking-tight">{item_name}</h2>
              </div>
              <Badge
                className={`py-1.5 px-3 flex items-center gap-1.5 text-xs font-bold border ${
                  recyclable
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-red-500/10 border-red-500/30 text-red-400"
                }`}
              >
                {recyclable ? (
                  <>
                    <Recycle className="h-3.5 w-3.5 animate-spin-slow" />
                    RECYCLABLE
                  </>
                ) : (
                  <>
                    <Trash2 className="h-3.5 w-3.5" />
                    NON-RECYCLABLE
                  </>
                )}
              </Badge>
            </div>
          </div>
        )}

        <CardContent className="p-6 flex flex-col gap-6">
          {!imageUrl && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold text-zinc-100 tracking-tight">{item_name}</h2>
                  <Badge className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    {category}
                  </Badge>
                </div>
                <p className="text-sm text-zinc-400">Material: <span className="text-zinc-200">{material}</span></p>
              </div>

              <Badge
                className={`py-1.5 px-3 self-start sm:self-center flex items-center gap-1.5 text-xs font-bold border ${
                  recyclable
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-red-500/10 border-red-500/30 text-red-400"
                }`}
              >
                {recyclable ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    RECYCLABLE
                  </>
                ) : (
                  <>
                    <X className="h-3.5 w-3.5" />
                    NON-RECYCLABLE
                  </>
                )}
              </Badge>
            </div>
          )}

          {/* AI Confidence Meter */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-semibold text-zinc-400 flex items-center gap-1">
                <HelpCircle className="h-3.5 w-3.5 text-zinc-500" />
                Scan Accuracy
              </span>
              <span className="text-xs font-bold text-emerald-400">{confidence}%</span>
            </div>
            <Progress value={confidence} className="h-2 bg-zinc-800" indicatorClassName="bg-gradient-to-r from-emerald-500 to-teal-400" />
          </div>

          {/* Grid of Key Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-zinc-900/40 border border-zinc-800/60 p-4 rounded-xl flex flex-col justify-between">
              <span className="text-xs text-zinc-500 font-semibold mb-1 block">DECOMPOSITION TIME</span>
              <span className="text-base font-bold text-amber-500">{decomposition_time}</span>
            </div>
            <div className="bg-zinc-900/40 border border-zinc-800/60 p-4 rounded-xl flex flex-col justify-between">
              <span className="text-xs text-zinc-500 font-semibold mb-1 block">DISPOSAL METHOD & BIN</span>
              <span className="text-sm font-semibold text-zinc-200">{disposal_bin}</span>
            </div>
          </div>

          {/* Warnings / What not to do */}
          {not_to_do && not_to_do.length > 0 && (
            <div className="bg-red-950/20 border border-red-900/20 rounded-xl p-4">
              <h3 className="text-sm font-bold text-red-400 flex items-center gap-2 mb-3">
                <ShieldAlert className="h-4 w-4" />
                What NOT to Do
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {not_to_do.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                    <span className="text-red-500 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Environmental Impact */}
          <div className="space-y-2 border-t border-zinc-900 pt-4">
            <h3 className="text-sm font-bold text-zinc-300 flex items-center gap-2">
              <Leaf className="h-4 w-4 text-emerald-500" />
              Environmental Impact
            </h3>
            <p className="text-xs leading-relaxed text-zinc-400">{environmental_impact}</p>
          </div>

          {/* Fun Fact */}
          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-4">
            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2 mb-1.5">
              <Sparkles className="h-4 w-4 text-amber-400" />
              Eco Fun Fact
            </h3>
            <p className="text-xs italic leading-relaxed text-zinc-300">"{fun_fact}"</p>
          </div>

          {/* Summary */}
          <div className="space-y-2 border-t border-zinc-900 pt-4">
            <h4 className="text-sm font-bold text-zinc-300">Analysis Summary</h4>
            <p className="text-xs leading-relaxed text-zinc-400">{summary}</p>
          </div>
        </CardContent>
      </Card>

      {/* Practical Advice Section */}
      <AdviceBox advice={advice} />
    </div>
  );
}

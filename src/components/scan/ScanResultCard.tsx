"use client";

import { Check, X, ShieldAlert, Sparkles, HelpCircle, Leaf, Recycle, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AdviceBox } from "./AdviceBox";
import { WasteAnalysisResult } from "@/types/scan";
import { useLanguage } from "@/context/LanguageContext";

interface ScanResultCardProps {
  result: WasteAnalysisResult;
  imageUrl?: string;
}

export function ScanResultCard({ result, imageUrl }: ScanResultCardProps) {
  const { language, t } = useLanguage();
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

  const recyclableText = recyclable
    ? (language === "uz" ? "QAYTA ISHLANADI" : "RECYCLABLE")
    : (language === "uz" ? "QAYTA ISHLANMAYDI" : "NON-RECYCLABLE");

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
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
              <div className="min-w-0">
                <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium mb-1 text-[10px] sm:text-xs">
                  {category}
                </Badge>
                <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight truncate">{item_name}</h2>
              </div>
              <Badge
                className={`py-1.5 px-3 flex items-center gap-1.5 text-[10px] sm:text-xs font-bold border shrink-0 ${
                  recyclable
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-red-500/10 border-red-500/30 text-red-400"
                }`}
              >
                {recyclable ? (
                  <>
                    <Recycle className="h-3.5 w-3.5 animate-spin-slow shrink-0" />
                    {recyclableText}
                  </>
                ) : (
                  <>
                    <Trash2 className="h-3.5 w-3.5 shrink-0" />
                    {recyclableText}
                  </>
                )}
              </Badge>
            </div>
          </div>
        )}

        <CardContent className="p-4 sm:p-6 flex flex-col gap-6">
          {!imageUrl && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-bold text-zinc-100 tracking-tight truncate max-w-full">{item_name}</h2>
                  <Badge className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] sm:text-xs shrink-0">
                    {category}
                  </Badge>
                </div>
                <p className="text-xs sm:text-sm text-zinc-400">Material: <span className="text-zinc-200">{material}</span></p>
              </div>

              <Badge
                className={`py-1.5 px-3 self-start sm:self-center flex items-center gap-1.5 text-[10px] sm:text-xs font-bold border shrink-0 ${
                  recyclable
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-red-500/10 border-red-500/30 text-red-400"
                }`}
              >
                {recyclable ? (
                  <>
                    <Check className="h-3.5 w-3.5 shrink-0" />
                    {recyclableText}
                  </>
                ) : (
                  <>
                    <X className="h-3.5 w-3.5 shrink-0" />
                    {recyclableText}
                  </>
                )}
              </Badge>
            </div>
          )}

          {/* AI Confidence Meter */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-semibold text-zinc-400 flex items-center gap-1">
                <HelpCircle className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                {t("result.accuracy")}
              </span>
              <span className="text-xs font-bold text-emerald-400">{confidence}%</span>
            </div>
            <Progress value={confidence} className="h-2 bg-zinc-800" indicatorClassName="bg-gradient-to-r from-emerald-500 to-teal-400" />
          </div>

          {/* Grid of Key Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-zinc-900/40 border border-zinc-800/60 p-4 rounded-xl flex flex-col justify-between">
              <span className="text-[10px] sm:text-xs text-zinc-500 font-semibold mb-1 block uppercase">{t("result.decomposition")}</span>
              <span className="text-sm sm:text-base font-bold text-amber-500">{decomposition_time}</span>
            </div>
            <div className="bg-zinc-900/40 border border-zinc-800/60 p-4 rounded-xl flex flex-col justify-between">
              <span className="text-[10px] sm:text-xs text-zinc-500 font-semibold mb-1 block uppercase">{t("result.disposal")}</span>
              <span className="text-xs sm:text-sm font-semibold text-zinc-200 leading-relaxed">{disposal_bin}</span>
            </div>
          </div>

          {/* Warnings / What not to do */}
          {not_to_do && not_to_do.length > 0 && (
            <div className="bg-red-950/20 border border-red-900/20 rounded-xl p-4">
              <h3 className="text-xs sm:text-sm font-bold text-red-400 flex items-center gap-2 mb-3">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                {t("result.not_to_do")}
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {not_to_do.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                    <span className="text-red-500 mt-0.5 shrink-0">•</span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Environmental Impact */}
          <div className="space-y-2 border-t border-zinc-900 pt-4">
            <h3 className="text-xs sm:text-sm font-bold text-zinc-300 flex items-center gap-2">
              <Leaf className="h-4 w-4 text-emerald-500 shrink-0" />
              {t("result.env_impact")}
            </h3>
            <p className="text-xs leading-relaxed text-zinc-400">{environmental_impact}</p>
          </div>

          {/* Fun Fact */}
          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-4">
            <h3 className="text-xs sm:text-sm font-bold text-amber-400 flex items-center gap-2 mb-1.5">
              <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
              {t("result.fun_fact")}
            </h3>
            <p className="text-xs italic leading-relaxed text-zinc-350">"{fun_fact}"</p>
          </div>

          {/* Summary */}
          <div className="space-y-2 border-t border-zinc-900 pt-4">
            <h4 className="text-xs sm:text-sm font-bold text-zinc-300">{t("result.summary")}</h4>
            <p className="text-xs leading-relaxed text-zinc-400">{summary}</p>
          </div>
        </CardContent>
      </Card>

      {/* Practical Advice Section */}
      <AdviceBox advice={advice} />
    </div>
  );
}

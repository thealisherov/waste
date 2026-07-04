"use client";

import { Award, Sparkles, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/context/LanguageContext";

interface EcoScoreCardProps {
  ecoScore: number;
  level: number;
  userName?: string;
}

export function EcoScoreCard({ ecoScore, level, userName }: EcoScoreCardProps) {
  const { t } = useLanguage();
  const currentPoints = ecoScore % 100;
  const pointsNeeded = 100 - currentPoints;
  const nextLevel = level + 1;

  return (
    <Card className="border-zinc-800 bg-zinc-950/60 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
      {/* Background Glow */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/15 transition-all duration-500"></div>

      <CardContent className="p-5 sm:p-6 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-zinc-100 flex items-center gap-1.5">
              <Award className="h-5 w-5 text-emerald-400" />
              {t("profile.eco_level")}
            </h3>
            <p className="text-[11px] sm:text-xs text-zinc-400 mt-0.5">{t("home.level_card_desc")}</p>
          </div>

          <div className="relative flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white font-extrabold text-xs sm:text-sm shadow-[0_0_15px_rgba(16,185,129,0.3)] shrink-0">
            Lvl {level}
          </div>
        </div>

        {/* Big Eco Score value */}
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 animate-pulse tracking-tight">
            {ecoScore}
          </span>
          <span className="text-[10px] sm:text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            {t("home.score_points")}
          </span>
        </div>

        {/* Progress bar to next level */}
        <div className="space-y-2">
          <div className="flex justify-between text-[11px] sm:text-xs font-semibold">
            <span className="text-zinc-400 flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
              Progress to Lvl {nextLevel}
            </span>
            <span className="text-emerald-400">{currentPoints} / 100 pts</span>
          </div>
          <Progress value={currentPoints} className="h-2.5 bg-zinc-900" indicatorClassName="bg-gradient-to-r from-emerald-500 to-teal-400" />
          <p className="text-[10px] text-zinc-500 italic text-right leading-relaxed">
            {t("home.points_to_next").replace("{points}", String(pointsNeeded)).replace("{level}", String(nextLevel))}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

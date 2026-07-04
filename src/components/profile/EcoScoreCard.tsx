"use client";

import { Award, Sparkles, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface EcoScoreCardProps {
  ecoScore: number;
  level: number;
  userName?: string;
}

export function EcoScoreCard({ ecoScore, level, userName }: EcoScoreCardProps) {
  const currentPoints = ecoScore % 100;
  const pointsNeeded = 100 - currentPoints;
  const nextLevel = level + 1;

  return (
    <Card className="border-zinc-800 bg-zinc-950/60 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
      {/* Background Glow */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/15 transition-all duration-500"></div>

      <CardContent className="p-6 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-1.5">
              <Award className="h-5 w-5 text-emerald-400" />
              Eco Level
            </h3>
            <p className="text-xs text-zinc-400">Keep scanning waste to level up!</p>
          </div>

          <div className="relative flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white font-extrabold text-lg shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            Lvl {level}
          </div>
        </div>

        {/* Big Eco Score value */}
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 animate-pulse tracking-tight">
            {ecoScore}
          </span>
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
            Eco Score Points
          </span>
        </div>

        {/* Progress bar to next level */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-zinc-400 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-emerald-400" />
              Progress to Lvl {nextLevel}
            </span>
            <span className="text-emerald-400">{currentPoints} / 100 pts</span>
          </div>
          <Progress value={currentPoints} className="h-2.5 bg-zinc-900" indicatorClassName="bg-gradient-to-r from-emerald-500 to-teal-400" />
          <p className="text-[10px] text-zinc-500 italic text-right">
            Earn {pointsNeeded} more points to reach Level {nextLevel}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

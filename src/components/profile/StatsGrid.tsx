"use client";

import { Scan, Database, FileText, Sparkles, Leaf, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsGridProps {
  stats: {
    total_scans: number;
    plastic_count: number;
    paper_count: number;
    glass_count: number;
    organic_count: number;
  };
}

export function StatsGrid({ stats }: StatsGridProps) {
  const otherCount = Math.max(
    0,
    stats.total_scans -
      (stats.plastic_count + stats.paper_count + stats.glass_count + stats.organic_count)
  );

  const statItems = [
    {
      title: "Total Scans",
      value: stats.total_scans,
      icon: Scan,
      color: "text-indigo-400 border-indigo-500/20 bg-indigo-500/5",
    },
    {
      title: "Plastic items",
      value: stats.plastic_count,
      icon: Database, // Representing synthetic polymers
      color: "text-amber-400 border-amber-500/20 bg-amber-500/5",
    },
    {
      title: "Paper items",
      value: stats.paper_count,
      icon: FileText,
      color: "text-sky-400 border-sky-500/20 bg-sky-500/5",
    },
    {
      title: "Glass items",
      value: stats.glass_count,
      icon: Sparkles, // Representing crystal/glass
      color: "text-cyan-400 border-cyan-500/20 bg-cyan-500/5",
    },
    {
      title: "Organic items",
      value: stats.organic_count,
      icon: Leaf,
      color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
    },
    {
      title: "Other items",
      value: otherCount,
      icon: Layers,
      color: "text-zinc-400 border-zinc-800 bg-zinc-900/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {statItems.map((item, idx) => {
        const Icon = item.icon;
        return (
          <Card
            key={idx}
            className={`border hover:border-zinc-700 transition-all duration-300 ${item.color.split(" ").slice(1).join(" ")}`}
          >
            <CardContent className="p-4 flex flex-col justify-between h-28">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-zinc-400 tracking-wider">
                  {item.title}
                </span>
                <Icon className={`h-4.5 w-4.5 ${item.color.split(" ")[0]}`} />
              </div>
              <span className="text-2xl font-extrabold text-zinc-100">{item.value}</span>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

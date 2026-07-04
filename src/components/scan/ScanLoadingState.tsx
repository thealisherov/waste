"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/translations";

export function ScanLoadingState() {
  const [step, setStep] = useState(0);
  const { language } = useLanguage();
  
  const steps = translations[language]?.loading_steps || translations["en"].loading_steps;

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2000);
    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <Card className="border-zinc-800 bg-zinc-950/60 backdrop-blur-xl shadow-2xl overflow-hidden max-w-2xl mx-auto w-full">
      <div className="w-full aspect-[16/9] relative bg-zinc-900/40 flex items-center justify-center border-b border-zinc-900">
        <div className="flex flex-col items-center gap-3">
          <div className="relative flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
            <div className="absolute w-8 h-8 border-4 border-teal-500/25 border-b-teal-400 rounded-full animate-spin-reverse"></div>
          </div>
          <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase animate-pulse text-center px-4">
            {steps[step]}
          </span>
        </div>
      </div>

      <CardContent className="p-4 sm:p-6 space-y-6">
        {/* Name and category skeleton */}
        <div className="flex justify-between items-center pb-4 border-b border-zinc-900">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32 sm:w-48 bg-zinc-850" />
            <Skeleton className="h-4 w-24 sm:w-32 bg-zinc-850" />
          </div>
          <Skeleton className="h-8 w-20 sm:w-24 bg-zinc-850 rounded-full" />
        </div>

        {/* Confidence scale skeleton */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-16 bg-zinc-850" />
            <Skeleton className="h-3 w-8 bg-zinc-850" />
          </div>
          <Skeleton className="h-2 w-full bg-zinc-850" />
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Skeleton className="h-20 w-full bg-zinc-850 rounded-xl" />
          <Skeleton className="h-20 w-full bg-zinc-850 rounded-xl" />
        </div>

        {/* What not to do skeleton */}
        <div className="border border-zinc-900 p-4 rounded-xl space-y-3">
          <Skeleton className="h-4 w-28 bg-zinc-850" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Skeleton className="h-3 w-full bg-zinc-850" />
            <Skeleton className="h-3 w-full bg-zinc-850" />
            <Skeleton className="h-3 w-full bg-zinc-850" />
            <Skeleton className="h-3 w-full bg-zinc-850" />
          </div>
        </div>

        {/* Environmental impact and fun facts skeletons */}
        <div className="space-y-2 pt-2">
          <Skeleton className="h-4 w-32 bg-zinc-850" />
          <Skeleton className="h-3 w-full bg-zinc-850" />
          <Skeleton className="h-3 w-5/6 bg-zinc-850" />
        </div>
      </CardContent>
    </Card>
  );
}

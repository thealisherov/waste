import { Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function AdviceBox({ advice }: { advice: string }) {
  return (
    <Card className="border-emerald-500/20 bg-emerald-950/10 backdrop-blur shadow-lg">
      <CardContent className="p-4 flex gap-3 items-start">
        <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 mt-0.5">
          <Lightbulb className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-emerald-400 mb-0.5">Quick Green Advice</h4>
          <p className="text-xs text-zinc-300 leading-relaxed">{advice}</p>
        </div>
      </CardContent>
    </Card>
  );
}

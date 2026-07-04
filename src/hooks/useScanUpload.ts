import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSaveScan } from "@/lib/queries/scans";
import { WasteAnalysisResult } from "@/types/scan";
import { useLanguage } from "@/context/LanguageContext";

export function useScanUpload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<WasteAnalysisResult | null>(null);
  const saveScanMutation = useSaveScan();
  const { language } = useLanguage();

  const uploadAndAnalyze = async (base64Data: string, userId: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const supabase = createClient();
      
      // Clean base64 string
      const rawBase64 = base64Data.includes(",") 
        ? base64Data.split(",")[1] 
        : base64Data;

      // Convert base64 to Blob
      const blob = await fetch(`data:image/jpeg;base64,${rawBase64}`).then((res) => res.blob());
      
      // File name structured under user's id for RLS policy compliance
      const fileName = `${userId}/${Date.now()}.jpg`;

      // 1. Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("scan-images")
        .upload(fileName, blob, {
          contentType: "image/jpeg",
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Upload error: ${uploadError.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("scan-images")
        .getPublicUrl(fileName);

      // 2. Call OpenAI Vision API route
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageBase64: rawBase64, language }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze image");
      }

      const aiResult: WasteAnalysisResult = await response.json();
      setResult(aiResult);

      // 3. Save scan to Supabase database
      await saveScanMutation.mutateAsync({
        user_id: userId,
        image_url: publicUrl,
        item_name: aiResult.item_name,
        category: aiResult.category,
        material: aiResult.material,
        recyclable: aiResult.recyclable,
        confidence: aiResult.confidence,
        decomposition_time: aiResult.decomposition_time,
        disposal_bin: aiResult.disposal_bin,
        not_to_do: aiResult.not_to_do,
        environmental_impact: aiResult.environmental_impact,
        fun_fact: aiResult.fun_fact,
        advice: aiResult.advice,
        summary: aiResult.summary,
      });

      return aiResult;
    } catch (err: any) {
      console.error("Upload and Analyze error:", err);
      setError(err.message || "Tahlil qilish jarayonida xatolik yuz berdi");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    uploadAndAnalyze,
    loading,
    error,
    result,
    setResult,
  };
}

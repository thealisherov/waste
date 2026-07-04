"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useScanUpload } from "@/hooks/useScanUpload";
import { CameraCapture } from "@/components/camera/CameraCapture";
import { ImageUploader } from "@/components/camera/ImageUploader";
import { ScanResultCard } from "@/components/scan/ScanResultCard";
import { ScanLoadingState } from "@/components/scan/ScanLoadingState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Image as ImageIcon, RotateCcw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

function ScanContent() {
  const searchParams = useSearchParams();
  const initialMethod = searchParams.get("method") === "upload" ? "upload" : "camera";
  const [activeTab, setActiveTab] = useState<string>(initialMethod);
  const [userId, setUserId] = useState<string | null>(null);
  const [capturedImageBase64, setCapturedImageBase64] = useState<string | null>(null);

  const { uploadAndAnalyze, loading, error, result, setResult } = useScanUpload();

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

  const handleCaptureOrUpload = async (base64: string) => {
    if (!userId) return;
    setCapturedImageBase64(base64);
    try {
      await uploadAndAnalyze(base64, userId);
    } catch (err) {
      console.error(err);
    }
  };

  const resetScanner = () => {
    setResult(null);
    setCapturedImageBase64(null);
  };

  // Rendering Loading State
  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-center text-white">Analyzing Rubbish</h1>
        <ScanLoadingState />
      </div>
    );
  }

  // Rendering Success State
  if (result) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Analysis Result</h1>
            <p className="text-zinc-400 text-xs">AI has completed categorizing the scanned waste item.</p>
          </div>
          <Button
            onClick={resetScanner}
            variant="outline"
            className="border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Scan Another Item
          </Button>
        </div>
        <ScanResultCard
          result={result}
          imageUrl={capturedImageBase64 ? `data:image/jpeg;base64,${capturedImageBase64}` : undefined}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Eco Waste Scanner</h1>
        <p className="text-zinc-400 text-sm">
          Snap a photo of the trash item or upload an image to start the classification process.
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="bg-red-950/20 border-red-900/30 text-red-300">
          <AlertTriangle className="h-4.5 w-4.5" />
          <AlertTitle>Scan Failed</AlertTitle>
          <AlertDescription className="text-xs">{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 bg-zinc-900 border border-zinc-850 p-1 rounded-xl mb-6">
          <TabsTrigger
            value="camera"
            className="rounded-lg text-xs font-semibold py-2.5 data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
          >
            <Camera className="mr-2 h-4 w-4" />
            Live Camera
          </TabsTrigger>
          <TabsTrigger
            value="upload"
            className="rounded-lg text-xs font-semibold py-2.5 data-[state=active]:bg-zinc-800 data-[state=active]:text-white"
          >
            <ImageIcon className="mr-2 h-4 w-4" />
            Upload File
          </TabsTrigger>
        </TabsList>

        <TabsContent value="camera" className="mt-0 outline-none">
          <CameraCapture onCapture={handleCaptureOrUpload} loading={loading} />
        </TabsContent>

        <TabsContent value="upload" className="mt-0 outline-none">
          <ImageUploader onUpload={handleCaptureOrUpload} loading={loading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function ScanPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center p-12 text-zinc-400">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-sm">Loading Waste Scanner...</p>
        </div>
      }
    >
      <ScanContent />
    </Suspense>
  );
}

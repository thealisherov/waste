"use client";

import Webcam from "react-webcam";
import { useRef, useState, useCallback } from "react";
import { Camera, AlertCircle, RefreshCw, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface CameraCaptureProps {
  onCapture: (base64: string) => void;
  loading: boolean;
}

export function CameraCapture({ onCapture, loading }: CameraCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const [hasError, setHasError] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      const base64 = imageSrc.split(",")[1];
      onCapture(base64);
    }
  }, [webcamRef, onCapture]);

  const toggleFacingMode = useCallback(() => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  }, []);

  const handleUserMediaError = useCallback(() => {
    setHasError(true);
  }, []);

  // Standard input fallback for mobile
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result && typeof reader.result === "string") {
          const base64 = reader.result.split(",")[1];
          onCapture(base64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="overflow-hidden border-zinc-800 bg-zinc-950/70 backdrop-blur-xl shadow-2xl relative">
      {!hasError ? (
        <div className="relative aspect-[4/3] w-full bg-black overflow-hidden group">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="h-full w-full object-cover"
            videoConstraints={{
              facingMode: facingMode,
              width: 1280,
              height: 720,
            }}
            onUserMediaError={handleUserMediaError}
          />
          {/* Overlay grid for aiming */}
          <div className="absolute inset-0 border-[20px] border-black/30 pointer-events-none flex items-center justify-center">
            <div className="w-48 h-48 border-2 border-dashed border-emerald-500/50 rounded-2xl animate-pulse"></div>
          </div>
          <div className="absolute top-3 left-3 bg-black/60 text-emerald-400 px-3 py-1 text-xs font-semibold rounded-full border border-emerald-500/30 backdrop-blur">
            Live Waste Scanner
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center aspect-[4/3] w-full bg-zinc-900/40 p-6 text-center border-b border-zinc-800">
          <AlertCircle className="h-12 w-12 text-amber-500 mb-4 animate-bounce" />
          <h3 className="text-lg font-semibold text-zinc-200 mb-1">Camera Permission Required</h3>
          <p className="text-sm text-zinc-400 max-w-xs mb-4">
            Could not access camera. Try enabling browser permissions or use the upload button below.
          </p>
        </div>
      )}

      <div className="p-4 flex flex-col gap-3 bg-zinc-950">
        <div className="flex gap-2 justify-center">
          {!hasError && (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleFacingMode}
                disabled={loading}
                className="border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                onClick={capture}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                <Camera className="mr-2 h-4 w-4" />
                {loading ? "Analyzing..." : "Scan Waste"}
              </Button>
            </>
          )}
        </div>

        {/* Fallback Native Input File upload */}
        <div className="relative w-full">
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileInput}
            disabled={loading}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
            id="native-camera-input"
          />
          <Button
            variant="outline"
            className="w-full border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:bg-zinc-800 hover:text-white border-dashed"
            disabled={loading}
          >
            <Upload className="mr-2 h-4 w-4" />
            {hasError ? "Take Photo / Choose Image" : "Or upload image"}
          </Button>
        </div>
      </div>
    </Card>
  );
}

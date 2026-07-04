import { NextResponse } from "next/server";
import { analyzeWasteImage } from "@/lib/openai/analyzeWaste";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { imageBase64 } = await req.json();
    if (!imageBase64) {
      return NextResponse.json({ error: "Image data is required" }, { status: 400 });
    }

    const result = await analyzeWasteImage(imageBase64);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("AI Analysis Error:", err);
    return NextResponse.json(
      { error: err.message || "AI tahlil xatosi" },
      { status: 500 }
    );
  }
}

import { openai } from "./client";
import { SYSTEM_PROMPT } from "./prompt";
import { WasteAnalysisResult } from "@/types/scan";

const wasteSchema = {
  type: "object",
  properties: {
    item_name: { type: "string", description: "Chiqindining aniq nomi, masalan 'Plastic Water Bottle'" },
    category: { type: "string", description: "Umumiy toifa: Plastic, Paper, Glass, Organic, Metal, E-waste, Hazardous" },
    material: { type: "string", description: "Aniq material turi, masalan 'PET (Polyethylene Terephthalate)'" },
    recyclable: { type: "boolean" },
    confidence: { type: "number", description: "0-100 oralig'ida ishonchlilik foizi" },
    decomposition_time: { type: "string", description: "Masalan 'Approximately 450 years'" },
    disposal_bin: { type: "string", description: "Qaysi konteynerga tashlash kerak va qanday tayyorlash (yuvish, qopqog'ini olish va h.k.)" },
    not_to_do: {
      type: "array",
      items: { type: "string" },
      description: "2-4 ta 'qilmaslik kerak' bandi"
    },
    environmental_impact: { type: "string", description: "Tabiatga tashlansa nima bo'lishi haqida qisqa tavsif" },
    fun_fact: { type: "string", description: "Shu material haqida qiziqarli fakt" },
    advice: { type: "string", description: "2-3 gaplik amaliy maslahat: bu chiqindi bilan aynan nima qilish kerak" },
    summary: { type: "string", description: "3-4 gaplik umumiy xulosa" }
  },
  required: [
    "item_name", "category", "material", "recyclable", "confidence",
    "decomposition_time", "disposal_bin", "not_to_do",
    "environmental_impact", "fun_fact", "advice", "summary"
  ],
  additionalProperties: false
};

export async function analyzeWasteImage(imageBase64: string): Promise<WasteAnalysisResult> {
  // Ensure image has the data:image/jpeg;base64, prefix
  let formattedImage = imageBase64;
  if (!imageBase64.startsWith("data:")) {
    formattedImage = `data:image/jpeg;base64,${imageBase64}`;
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: [
          { type: "text", text: "Analyze the waste in this image." },
          { type: "image_url", image_url: { url: formattedImage } },
        ],
      },
    ],
    response_format: {
      type: "json_schema",
      json_schema: { name: "waste_analysis", schema: wasteSchema, strict: true },
    },
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error("Empty response from OpenAI");
  }

  return JSON.parse(content) as WasteAnalysisResult;
}

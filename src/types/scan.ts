import { z } from "zod";

export const wasteAnalysisSchema = z.object({
  item_name: z.string().describe("Precise name of the waste item, e.g. 'Plastic Water Bottle'"),
  category: z.string().describe("General category: Plastic, Paper, Glass, Organic, Metal, E-waste, Hazardous"),
  material: z.string().describe("Specific type of material, e.g. 'PET (Polyethylene Terephthalate)'"),
  recyclable: z.boolean(),
  confidence: z.number().describe("Confidence percentage between 0 and 100"),
  decomposition_time: z.string().describe("Estimated decomposition time, e.g. 'Approximately 450 years'"),
  disposal_bin: z.string().describe("Which bin to dispose it in and how to prepare it (rinse, remove cap, etc.)"),
  not_to_do: z.array(z.string()).describe("2-4 points on what not to do with this item"),
  environmental_impact: z.string().describe("A brief description of what happens if it's discarded in nature"),
  fun_fact: z.string().describe("A fun or interesting fact about this material/item"),
  advice: z.string().describe("2-3 sentences of practical advice on what exactly to do with this waste"),
  summary: z.string().describe("3-4 sentences summarizing the waste analysis")
});

export type WasteAnalysisResult = z.infer<typeof wasteAnalysisSchema>;

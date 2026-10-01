import { NextRequest, NextResponse } from "next/server";
import { callGroq, GROQ_VISION_MODEL } from "../../../../src/lib/groq";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;

    if (!imageFile) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const arrayBuffer = await imageFile.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");
    const dataUri = `data:${imageFile.type};base64,${base64Data}`;

    const prompt = `You are an expert at extracting menu items from restaurant menus.
Look at this menu image and extract all the dishes.
Respond with a JSON object of the exact shape {"items": [...]}, where each entry in "items" has these exact fields:
- "name" (string): the name of the dish
- "description" (string): brief description if available, else empty string
- "price" (number): the price of the dish as a plain number (e.g., 250)
- "category" (string): the category or section (e.g., "Starters", "Pizza")
- "type" (string): "Veg" or "Non Veg" (infer if possible, otherwise guess "Veg")

Return only the JSON object, no other text or markdown.`;

    const raw = await callGroq({
      model: GROQ_VISION_MODEL,
      jsonMode: true,
      content: [
        { type: "text", text: prompt },
        { type: "image_url", image_url: { url: dataUri } },
      ],
    });

    const cleanJson = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleanJson);
    const parsedItems = Array.isArray(parsed) ? parsed : parsed.items || [];

    return NextResponse.json({ items: parsedItems });
  } catch (error: any) {
    console.error("Scan Menu Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to parse menu image" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { callGroq, GROQ_VISION_MODEL } from "../../../../src/lib/groq";

// Singular stems so "burger menu" still matches "burgers", "dessert" still matches
// "desserts", etc. Keyed by the canonical (plural, lowercase) category value.
const CATEGORY_STEMS: Record<string, string> = {
  starters: "starter",
  pizza: "pizza",
  burgers: "burger",
  pasta: "pasta",
  drinks: "drink",
  desserts: "dessert",
};

// Defense in depth: even with an explicit prompt constraint, a vision model can still
// return a raw section heading from the photographed menu (e.g. "pizza menu" instead of
// "pizza"). Snap anything close to a known category onto it instead of trusting the model.
function normalizeCategory(raw: string | undefined): string {
  const value = (raw || "").toLowerCase().trim();
  const exact = Object.keys(CATEGORY_STEMS).find((c) => c === value);
  if (exact) return exact;
  const contains = Object.entries(CATEGORY_STEMS).find(([, stem]) => value.includes(stem));
  if (contains) return contains[0];
  return "starters";
}

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
- "category" (string): MUST be exactly one of these lowercase values: "starters", "pizza", "burgers", "pasta", "drinks", "desserts". Map the dish to whichever of these it fits best, even if the menu's own section heading uses different wording (e.g. a "PIZZA MENU" section heading still means category "pizza", not "pizza menu"). If nothing fits well, use "starters".
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
    const parsedItems = (Array.isArray(parsed) ? parsed : parsed.items || []).map((item: any) => ({
      ...item,
      category: normalizeCategory(item.category),
    }));

    return NextResponse.json({ items: parsedItems });
  } catch (error: any) {
    console.error("Scan Menu Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to parse menu image" },
      { status: 500 }
    );
  }
}

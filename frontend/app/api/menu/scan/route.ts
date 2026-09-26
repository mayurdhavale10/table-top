import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;

    if (!imageFile) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured in .env.local" },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Read the file as an ArrayBuffer and convert to Base64 for the API
    const arrayBuffer = await imageFile.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");

    const prompt = `You are an expert at extracting menu items from restaurant menus. 
Please look at this menu image and extract all the dishes.
Return a valid JSON array of objects, where each object has these exact fields:
- "name" (string): the name of the dish
- "description" (string): brief description if available, else empty string
- "price" (number): the price of the dish as a plain number (e.g., 250)
- "category" (string): the category or section (e.g., "Starters", "Pizza")
- "type" (string): "Veg" or "Non Veg" (infer if possible, otherwise guess "Veg")

Do not include any other text, markdown blocks, or formatting, just the raw JSON array.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        prompt,
        {
          inlineData: {
            data: base64Data,
            mimeType: imageFile.type,
          },
        },
      ],
    });

    const textResponse = response.text || "[]";
    
    // Strip out markdown code blocks if the AI returned them despite instructions
    const cleanJson = textResponse.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    const parsedItems = JSON.parse(cleanJson);

    return NextResponse.json({ items: parsedItems });

  } catch (error: any) {
    console.error("Scan Menu Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to parse menu image" },
      { status: 500 }
    );
  }
}

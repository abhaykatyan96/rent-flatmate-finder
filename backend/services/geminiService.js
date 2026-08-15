import { GoogleGenAI } from "@google/genai";

export const generateCompatibility = async (listing, tenant) => {

    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY
    });

    try {

        const prompt = `
You are a room compatibility engine.

Tenant Profile:
Preferred Location: ${tenant.preferredLocation}
Budget: ${tenant.minBudget}-${tenant.maxBudget}
Move In Date: ${tenant.moveInDate}

Room Listing:
Location: ${listing.location}
Rent: ${listing.rent}
Available From: ${listing.availableFrom}
Room Type: ${listing.roomType}
Furnishing: ${listing.furnishingStatus}

Return ONLY valid JSON.

{
"score":90,
"explanation":"..."
}
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        let text = response.text;

        // Remove markdown code fences if Gemini returns them
        text = text.replace(/```json|```/g, "").trim();

        return JSON.parse(text);

    } catch (error) {

        console.error(error);

        return null;

    }

};
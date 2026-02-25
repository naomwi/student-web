import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
console.log("API Key (first 10 chars):", apiKey?.substring(0, 10) + "...");

const genAI = new GoogleGenerativeAI(apiKey);

async function test() {
    try {
        // Try gemini-2.0-flash first
        console.log("\n--- Testing gemini-2.0-flash ---");
        const model1 = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result1 = await model1.generateContent("Say hi in Vietnamese");
        console.log("SUCCESS:", result1.response.text());
    } catch (e) {
        console.error("FAILED gemini-2.0-flash:", e.message || e);
    }

    try {
        // Try gemini-2.0-flash-001
        console.log("\n--- Testing gemini-2.0-flash-001 ---");
        const model2 = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });
        const result2 = await model2.generateContent("Say hi in Vietnamese");
        console.log("SUCCESS:", result2.response.text());
    } catch (e) {
        console.error("FAILED gemini-2.0-flash-001:", e.message || e);
    }

    try {
        // Try the model the user wanted
        console.log("\n--- Testing gemini-3.0-flash-preview ---");
        const model3 = genAI.getGenerativeModel({ model: "gemini-3.0-flash-preview" });
        const result3 = await model3.generateContent("Say hi in Vietnamese");
        console.log("SUCCESS:", result3.response.text());
    } catch (e) {
        console.error("FAILED gemini-3.0-flash-preview:", e.message || e);
    }
}

test();

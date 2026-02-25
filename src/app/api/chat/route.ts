import { GoogleGenerativeAI } from "@google/generative-ai";

export const maxDuration = 30;

const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";

const genAI = new GoogleGenerativeAI(apiKey);

const SYSTEM_INSTRUCTION = `Bạn là "Gia sư AI" của mạng xã hội sinh viên UniConnect.
Nhiệm vụ của bạn là hỗ trợ sinh viên trả lời câu hỏi, giải đáp thắc mắc về các môn học (Toán, Lý, Hóa, CNTT, Kinh Tế,...), và tư vấn lịch trình học tập.
Hãy luôn xưng hô một cách thân thiện, dùng từ ngữ dễ hiểu, súc tích và mạch lạc. Có thể dùng emoji phù hợp.
Khi người dùng gặp bài tập khó, đừng chỉ đưa ra đáp án cuối cùng, hãy gợi ý từng bước giải hoặc giải thích khái niệm cốt lõi.`;

export async function POST(req: Request) {
    try {
        if (!apiKey) {
            return new Response(
                JSON.stringify({ error: "Missing GOOGLE_GENERATIVE_AI_API_KEY in .env.local" }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            );
        }

        const { messages } = await req.json();

        console.log("[AI Tutor] Received", messages.length, "messages. Using model: gemini-3-flash-preview");
        console.log("[AI Tutor] API Key starts with:", apiKey.substring(0, 10) + "...");

        const model = genAI.getGenerativeModel({
            model: "gemini-3-flash-preview",
            systemInstruction: SYSTEM_INSTRUCTION,
        });

        // Build chat history from messages (exclude last user message)
        const history = messages.slice(0, -1).map((msg: any) => ({
            role: msg.role === "assistant" ? "model" : "user",
            parts: [{ text: msg.content }],
        }));

        const chat = model.startChat({ history });

        // Get the last user message
        const lastMessage = messages[messages.length - 1];

        console.log("[AI Tutor] Sending message:", lastMessage.content.substring(0, 50));

        // Use streaming for real-time response
        const result = await chat.sendMessageStream(lastMessage.content);

        // Create a ReadableStream to send chunks to the client
        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                try {
                    for await (const chunk of result.stream) {
                        const text = chunk.text();
                        if (text) {
                            controller.enqueue(encoder.encode(text));
                        }
                    }
                } catch (streamError: any) {
                    console.error("[AI Tutor] Stream error:", streamError?.message || streamError);
                    // Send error as text so user sees it
                    controller.enqueue(encoder.encode(`\n\n[Lỗi stream: ${streamError?.message || "Unknown"}]`));
                } finally {
                    controller.close();
                }
            },
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
            },
        });
    } catch (error: any) {
        const errorMsg = error?.message || error?.toString() || "Unknown error";
        console.error("[AI Tutor] Gemini API Error:", errorMsg);
        console.error("[AI Tutor] Full error:", JSON.stringify(error, null, 2));
        return new Response(
            JSON.stringify({
                error: `Lỗi kết nối AI: ${errorMsg}`,
                hint: "Kiểm tra API Key và tên model trong route.ts"
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}

import { GoogleGenerativeAI } from "@google/generative-ai";

export const maxDuration = 30;

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

const SYSTEM_INSTRUCTION = `Bạn là "Gia sư AI" của mạng xã hội sinh viên UniConnect.
Nhiệm vụ của bạn là hỗ trợ sinh viên trả lời câu hỏi, giải đáp thắc mắc về các môn học (Toán, Lý, Hóa, CNTT, Kinh Tế,...), và tư vấn lịch trình học tập.
Hãy luôn xưng hô một cách thân thiện, dùng từ ngữ dễ hiểu, súc tích và mạch lạc. Có thể dùng emoji phù hợp.
Khi người dùng gặp bài tập khó, đừng chỉ đưa ra đáp án cuối cùng, hãy gợi ý từng bước giải hoặc giải thích khái niệm cốt lõi.`;

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
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
                            // Send as simple text chunks
                            controller.enqueue(encoder.encode(text));
                        }
                    }
                } catch (error) {
                    console.error("Stream error:", error);
                } finally {
                    controller.close();
                }
            },
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Transfer-Encoding": "chunked",
            },
        });
    } catch (error) {
        console.error("Gemini API Error:", error);
        return new Response(
            JSON.stringify({ error: "Có lỗi khi kết nối với máy chủ AI." }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}

import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        const result = streamText({
            model: google('gemini-3.0-flash-preview'),
            system: `Bạn là "Gia sư AI" của mạng xã hội sinh viên UniConnect. 
      Nhiệm vụ của bạn là hỗ trợ sinh viên trả lời câu hỏi, giải đáp thắc mắc về các môn học (Toán, Lý, Hóa, CNTT, Kinh Tế,...), và tư vấn lịch trình học tập.
      Hãy luôn xưng hô một cách thân thiện, dùng từ ngữ dễ hiểu, súc tích và mạch lạc. Có thể dùng emoji phù hợp.
      Khi người dùng gặp bài tập khó, đừng chỉ đưa ra đáp án cuối cùng, hãy gợi ý từng bước giải hoặc giải thích khái niệm cốt lõi.`,
            messages,
            temperature: 0.7,
        });

        return result.toDataStreamResponse();
    } catch (error) {
        console.error("Gemini API Error:", error);
        return new Response(JSON.stringify({ error: "Có lỗi khi kết nối với máy chủ AI." }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}

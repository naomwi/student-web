"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

// Khởi tạo Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function summarizeContent(content: string) {
  if (!process.env.GOOGLE_API_KEY) {
    return { error: "Chưa cấu hình API Key cho AI." };
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Hãy tóm tắt nội dung sau đây thành 3 gạch đầu dòng ngắn gọn, súc tích dành cho sinh viên:

${content}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return { summary: text };
  } catch (error: any) {
    console.error("AI Error:", error);
    return { error: "Không thể tóm tắt lúc này." };
  }
}

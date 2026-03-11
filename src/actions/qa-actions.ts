"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const QuestionSchema = z.object({
  title: z.string().min(10, "Tiêu đề phải có ít nhất 10 ký tự").max(100, "Tiêu đề không được quá 100 ký tự"),
  content: z.string().min(20, "Nội dung câu hỏi phải chi tiết hơn (tối thiểu 20 ký tự)"),
  tags: z.string().optional(),
});

const AnswerSchema = z.object({
  content: z.string().min(5, "Câu trả lời quá ngắn"),
  questionId: z.string().uuid(),
});

// 1. Tạo Câu hỏi
export async function createQuestion(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Bạn cần đăng nhập để thực hiện hành động này." };

  const rawTags = (formData.get("tags") as string) || "";
  const tagsArray = rawTags.split(",").map(t => t.trim()).filter(Boolean);
  
  // Xử lý ảnh (nhận chuỗi JSON hoặc string phân cách)
  const rawImages = (formData.get("images") as string) || "";
  const imagesArray = rawImages ? rawImages.split(",") : [];

  const rawData = {
    title: formData.get("title"),
    content: formData.get("content"),
    tags: formData.get("tags"),
  };

  const validated = QuestionSchema.safeParse(rawData);
  
  if (!validated.success) {
    const fieldErrors = validated.error.flatten().fieldErrors;
    const errorMessage = Object.values(fieldErrors).flat()[0] || "Dữ liệu không hợp lệ";
    return { error: errorMessage };
  }

  const { error } = await supabase.from("questions").insert({
    author_id: user.id,
    title: validated.data.title,
    content: validated.data.content,
    tags: tagsArray,
    images: imagesArray, // Lưu mảng URL ảnh
  });

  if (error) {
    console.error("Database Insert Error:", error);
    return { error: "Lỗi hệ thống: " + error.message };
  }

  revalidatePath("/fptcolearn/qa");
  return { success: "Đã đăng câu hỏi thành công!" };
}

// 2. Gửi Câu trả lời
export async function submitAnswer(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const rawData = {
    content: formData.get("content"),
    questionId: formData.get("questionId"),
  };

  const validated = AnswerSchema.safeParse(rawData);
  if (!validated.success) return { error: validated.error.issues[0]?.message };

  const { error } = await supabase.from("answers").insert({
    author_id: user.id,
    question_id: validated.data.questionId,
    content: validated.data.content,
  });

  if (error) return { error: error.message };

  revalidatePath(`/fptcolearn/qa/${validated.data.questionId}`);
  return { success: "Đã gửi câu trả lời!" };
}

// 3. Chấp nhận câu trả lời đúng
export async function acceptAnswer(answerId: string, questionId: string) {
  const supabase = await createClient();
  
  await supabase
    .from("answers")
    .update({ is_accepted: false })
    .eq("question_id", questionId);

  const { error } = await supabase
    .from("answers")
    .update({ is_accepted: true })
    .eq("id", answerId);

  if (error) return { error: error.message };

  revalidatePath(`/fptcolearn/qa/${questionId}`);
  return { success: "Đã chấp nhận câu trả lời!" };
}
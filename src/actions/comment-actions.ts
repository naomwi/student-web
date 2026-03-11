"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const CommentSchema = z.object({
  content: z.string().min(1, "Nội dung không được để trống"),
  postId: z.string().uuid(),
});

export async function addComment(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Bạn cần đăng nhập để bình luận." };

  const rawData = {
    content: formData.get("content"),
    postId: formData.get("postId"),
  };

  const validated = CommentSchema.safeParse(rawData);
  if (!validated.success) return { error: "Dữ liệu không hợp lệ" };

  const { error } = await supabase
    .from("comments")
    .insert({
      content: validated.data.content,
      post_id: validated.data.postId,
      user_id: user.id,
    });

  if (error) return { error: "Lỗi hệ thống khi gửi bình luận." };

  revalidatePath(`/dashboard/blog`); 
  // Revalidate cả trang detail (sẽ được gọi dynamic sau)
  return { success: true };
}

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updatePostWithLog(postId: string, newContent: string, newTitle: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  // 1. Lấy nội dung cũ
  const { data: oldPost } = await supabase
    .from("posts")
    .select("content, title, author_id")
    .eq("id", postId)
    .single();

  if (!oldPost) return { error: "Bài viết không tồn tại" };
  if (oldPost.author_id !== user.id) return { error: "Bạn không có quyền sửa bài này" };

  // 2. Ghi Log
  const { error: logError } = await supabase.from("edit_logs").insert({
    target_id: postId,
    target_type: 'post',
    old_content: `Title: ${oldPost.title}
Content: ${oldPost.content}`,
    new_content: `Title: ${newTitle}
Content: ${newContent}`,
    edited_by: user.id
  });

  if (logError) console.error("Log error:", logError);

  // 3. Update Bài viết
  const { error } = await supabase
    .from("posts")
    .update({ 
      content: newContent, 
      title: newTitle,
      updated_at: new Date().toISOString()
    })
    .eq("id", postId);

  if (error) return { error: error.message };

  revalidatePath(`/dashboard/blog`);
  return { success: true };
}

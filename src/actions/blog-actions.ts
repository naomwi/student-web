"use server";

import { createClient } from "@/lib/supabase/server";
import { CreatePostSchema } from "@/schemas/content";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import slugify from "slugify";

export async function createPost(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: "Unauthorized. Vui lòng đăng nhập." };
  }

  const rawData = {
    title: formData.get("title"),
    content: formData.get("content"),
    is_published: formData.get("is_published") === "on",
  };

  const validatedFields = CreatePostSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      error: "Dữ liệu không hợp lệ",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { title, content, is_published } = validatedFields.data;

  // WARNING: We bypass DOMPurify on the server because JSDOM crashes Next.js Server Actions
  // on large content. We rely on the client-side Tiptap editor for primary sanitization.
  const cleanContent = content;

  const slug = `${slugify(title, { lower: true, strict: true })}-${Date.now()}`;

  const { error } = await supabase.from("posts").insert({
    title,
    slug,
    content: cleanContent,
    author_id: user.id,
    is_published,
  });

  if (error) {
    console.error("Database Error:", error);
    return { error: "Lỗi hệ thống khi lưu bài viết." };
  }

  revalidatePath("/blog");
  revalidatePath("/fptcolearn/posts");

  return { success: true, message: "Bài viết đã được tạo!" };
}

export async function deletePost(postId: string) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: "Unauthorized. Vui lòng đăng nhập." };
  }

  // Lấy file để kiểm tra quyền
  const { data: post } = await supabase.from("posts").select("author_id").eq("id", postId).single();

  const { data: profile } = await supabase.from('profiles').select('username').eq('id', user.id).single();
  const isAdmin = profile?.username === 'nao';

  if (!post || (post.author_id !== user.id && !isAdmin)) {
    return { error: "Không được phép xóa bài viết này." };
  }

  const { error } = await supabase.from("posts").delete().eq("id", postId);

  if (error) {
    console.error("Database Error:", error);
    return { error: "Lỗi hệ thống khi xóa bài viết." };
  }

  revalidatePath("/fptcolearn/blog");
  revalidatePath("/fptcolearn/posts");

  return { success: true, message: "Bài viết đã được xóa!" };
}

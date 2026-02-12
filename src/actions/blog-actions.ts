"use server";

import { createClient } from "@/lib/supabase/server";
import { CreatePostSchema } from "@/schemas/content";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import slugify from "slugify";
import DOMPurify from "isomorphic-dompurify";

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

  const cleanContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'h1', 'h2', 'ul', 'ol', 'li', 'br', 'img'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class'],
  });

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
  revalidatePath("/dashboard/posts");

  return { success: true, message: "Bài viết đã được tạo!" };
}

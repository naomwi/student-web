import { z } from "zod";

export const CreatePostSchema = z.object({
  title: z.string().min(5, "Tiêu đề quá ngắn").max(100),
  content: z.string().min(50, "Nội dung quá ngắn"),
  is_published: z.boolean().default(false),
});

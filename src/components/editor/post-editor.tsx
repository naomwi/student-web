"use client";

import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreatePostSchema } from "@/schemas/content";
import { createPost } from "@/actions/blog-actions";
import { z } from "zod";
import Tiptap from "@/components/editor/tiptap";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export function PostEditor() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  
  const form = useForm<z.infer<typeof CreatePostSchema>>({
    resolver: zodResolver(CreatePostSchema),
    defaultValues: { title: "", content: "", is_published: true },
  });

  const onSubmit = (data: z.infer<typeof CreatePostSchema>) => {
    // Hack: Append data to FormData because Server Action expects FormData (optional but cleaner for file uploads later)
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    formData.append("is_published", data.is_published ? "on" : "off");

    startTransition(async () => {
      const result = await createPost(null, formData);
      if (result?.error) {
        alert(result.error);
      } else {
        router.push("/dashboard/blog");
      }
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-3xl mx-auto bg-white p-8 rounded-lg border shadow-sm">
      <div className="space-y-2">
        <Label htmlFor="title">Tiêu đề bài viết</Label>
        <Input 
          id="title" 
          placeholder="Ví dụ: Cách học tốt môn Giải tích 1..." 
          {...form.register("title")} 
        />
        {form.formState.errors.title && (
          <p className="text-red-500 text-sm">{form.formState.errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Nội dung</Label>
        <Tiptap 
          content={form.watch("content")} 
          onChange={(html) => form.setValue("content", html)} 
        />
        {form.formState.errors.content && (
          <p className="text-red-500 text-sm">{form.formState.errors.content.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="ghost" onClick={() => router.back()}>Hủy bỏ</Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Đang đăng..." : "Đăng bài ngay"}
        </Button>
      </div>
    </form>
  );
}

"use client";

import { useTransition, useRef } from "react";
import { addComment } from "@/actions/comment-actions";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import Image from "next/image";
import { ReportButton } from "@/components/common/report-button";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  profiles: { full_name: string; avatar_url: string | null } | null;
}

export function CommentSection({ postId, comments }: { postId: string, comments: Comment[] }) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      await addComment(null, formData);
      formRef.current?.reset();
    });
  };

  return (
    <div className="mt-10 space-y-6">
      <h3 className="text-xl font-bold">Bình luận ({comments.length})</h3>

      {/* Comment Form */}
      <form ref={formRef} action={handleSubmit} className="flex gap-4">
        <input type="hidden" name="postId" value={postId} />
        <textarea
          name="content"
          placeholder="Viết bình luận của bạn..."
          className="flex-1 min-h-[80px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <Button type="submit" disabled={isPending} className="self-end">
          {isPending ? "Đang gửi..." : "Gửi"}
        </Button>
      </form>

      {/* Comment List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
             <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden relative">
               {comment.profiles?.avatar_url ? (
                 <Image 
                   src={comment.profiles.avatar_url} 
                   alt="Avt" 
                   fill
                   className="object-cover"
                 />
               ) : (
                 <User className="h-6 w-6 text-gray-500" />
               )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{comment.profiles?.full_name || "Người dùng ẩn danh"}</span>
                <span className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleDateString()}</span>
                <ReportButton targetId={comment.id} targetType="comment" />
              </div>
              <p className="text-gray-700 mt-1">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
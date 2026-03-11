"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deletePost } from "@/actions/blog-actions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner"; // Assuming sonner is used, if not, native alert or another toast

export function DeletePostButton({ postId }: { postId: string }) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleDelete = () => {
        if (!confirm("Bạn có chắc chắn muốn xóa bài viết này không? Không thể hoàn tác.")) {
            return;
        }

        startTransition(async () => {
            const result = await deletePost(postId);
            if (result.error) {
                alert(result.error);
            } else {
                alert("Đã xóa bài viết!");
                router.push("/fptcolearn/blog");
            }
        });
    };

    return (
        <Button
            variant="destructive"
            size="sm"
            className="flex items-center gap-2"
            disabled={isPending}
            onClick={handleDelete}
        >
            <Trash2 className="h-4 w-4" />
            {isPending ? "Đang xóa..." : "Xóa bài"}
        </Button>
    );
}

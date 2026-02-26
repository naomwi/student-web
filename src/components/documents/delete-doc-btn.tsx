"use client";

import { useTransition } from "react";
import { deleteDocument } from "@/actions/document-actions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export function DeleteDocBtn({ documentId, storagePath }: { documentId: string, storagePath: string }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (!confirm("Bạn có chắc chắn muốn xóa tài liệu này?")) {
            return;
        }

        startTransition(async () => {
            const result = await deleteDocument(documentId, storagePath);
            if (result.error) {
                alert(result.error);
            } else {
                // revalidatePath will refresh the page via server action
            }
        });
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
            disabled={isPending}
            onClick={handleDelete}
            title="Xóa tài liệu"
        >
            <Trash2 className="h-4 w-4" />
        </Button>
    );
}

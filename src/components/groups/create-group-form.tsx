"use client";

import { createGroup } from "@/actions/group-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function CreateGroupForm({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await createGroup(null, formData);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Tạo nhóm thành công!");
        onClose();
        router.refresh();
      }
    });
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Tên nhóm</label>
        <Input name="name" required placeholder="Học nhóm Giải tích 1..." />
      </div>
      <div>
        <label className="text-sm font-medium">Mô tả ngắn</label>
        <Input name="description" placeholder="Mục tiêu, thời gian học..." />
      </div>
      <div>
        <label className="text-sm font-medium">Thêm thành viên (Username)</label>
        <Input name="members" placeholder="nguyen_a, tran_b (phân cách bằng dấu phẩy)" />
        <p className="text-[10px] text-muted-foreground mt-1">Nhập username của các thành viên bạn muốn mời.</p>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" type="button" onClick={onClose}>Hủy</Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Đang tạo..." : "Tạo nhóm"}
        </Button>
      </div>
    </form>
  );
}

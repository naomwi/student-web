"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const ReportSchema = z.object({
  targetId: z.string().uuid(),
  targetType: z.enum(["post", "comment", "document"]),
  reason: z.string().min(5, "Lý do báo cáo phải dài hơn 5 ký tự"),
});

export async function submitReport(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const rawData = {
    targetId: formData.get("targetId"),
    targetType: formData.get("targetType"),
    reason: formData.get("reason"),
  };

  const validated = ReportSchema.safeParse(rawData);
  if (!validated.success) return { error: "Dữ liệu không hợp lệ" };

  const { error } = await supabase.from("reports").insert({
    reporter_id: user.id,
    target_id: validated.data.targetId,
    target_type: validated.data.targetType,
    reason: validated.data.reason,
  });

  if (error) return { error: "Lỗi hệ thống." };

  return { success: "Đã gửi báo cáo. Cảm ơn bạn đã đóng góp!" };
}

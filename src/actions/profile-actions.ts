"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ProfileUpdateSchema = z.object({
  full_name: z.string().min(2, "Tên quá ngắn"),
  username: z.string().min(3, "Username tối thiểu 3 ký tự").regex(/^[a-zA-Z0-9_]+$/, "Username chỉ chứa chữ, số và _").optional().or(z.literal("")),
  major: z.string().optional(),
  bio: z.string().max(500, "Bio tối đa 500 ký tự").optional().or(z.literal("")),
  avatar_url: z.string().url("Link ảnh không hợp lệ").optional().or(z.literal("")),
  year: z.coerce.number().min(1).max(10).optional(),
  is_mentor: z.boolean().optional(),
  linkedin_url: z.string().optional().or(z.literal("")),
  skills: z.string().optional(), // Will be split later
});

export async function updateProfile(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const rawData = {
    full_name: formData.get("full_name"),
    username: formData.get("username"),
    major: formData.get("major"),
    bio: formData.get("bio"),
    avatar_url: formData.get("avatar_url"),
    // Fix: Convert empty string to undefined so optional() works, otherwise coerce makes it 0
    year: formData.get("year") ? formData.get("year") : undefined,
    is_mentor: formData.get("is_mentor") === "on",
    linkedin_url: formData.get("linkedin_url") || "",
    skills: formData.get("skills") || "",
  };

  const validated = ProfileUpdateSchema.safeParse(rawData);

  if (!validated.success) {
    console.error("Validation Error:", validated.error);
    // Fix: Safe access to error message
    const errorMessage = validated.error?.errors?.[0]?.message || "Dữ liệu nhập vào không hợp lệ.";
    return { error: errorMessage };
  }

  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  // Logic: Only allow updating username if it's currently NULL
  let usernameToUpdate = validated.data.username;

  if (currentProfile?.username) {
    // If username already set, ignore any changes to it
    usernameToUpdate = undefined;
  } else if (!usernameToUpdate) {
    // If not set and not providing one, keep as is (null/undefined)
    usernameToUpdate = undefined;
  }

  // Convert skills string to array
  const skillsArray = validated.data.skills
    ? validated.data.skills.split(',').map(s => s.trim()).filter(s => s.length > 0)
    : [];

  // Update object
  const updates: any = {
    full_name: validated.data.full_name,
    avatar_url: validated.data.avatar_url || null,
    major: validated.data.major,
    bio: validated.data.bio,
    year: validated.data.year,
    is_mentor: validated.data.is_mentor,
    linkedin_url: validated.data.linkedin_url,
    skills: skillsArray,
    updated_at: new Date().toISOString(),
  };

  if (usernameToUpdate) {
    updates.username = usernameToUpdate;
  }

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id);

  if (error) {
    console.error("Supabase Error:", error);
    if (error.code === '23505') {
      return { error: "Username đã tồn tại, vui lòng chọn tên khác." };
    }
    return { error: `Lỗi khi cập nhật hồ sơ: ${error.message}` };
  }

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/mentors");
  return { success: "Cập nhật hồ sơ thành công!" };
}

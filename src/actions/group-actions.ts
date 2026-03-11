"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const CreateGroupSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên nhóm"),
  description: z.string().optional(),
  members: z.string().optional(),
});

export async function createGroup(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const rawData = {
    name: formData.get("name"),
    description: formData.get("description"),
    members: formData.get("members"),
  };

  const validated = CreateGroupSchema.safeParse(rawData);

  if (!validated.success) return { error: validated.error?.errors?.[0]?.message || "Dữ liệu không hợp lệ" };

  // Resolve members by username
  const memberUsernames = validated.data.members
    ? validated.data.members.split(',').map(s => s.trim()).filter(s => s.length > 0)
    : [];

  let memberIds: string[] = [];
  if (memberUsernames.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id")
      .in("username", memberUsernames);
    
    if (profiles) {
      memberIds = profiles.map(p => p.id);
    }
  }

  // Create a channel for the group
  const { data: channel, error: channelError } = await supabase
    .from("channels")
    .insert({
      name: validated.data.name,
      type: "group"
    })
    .select()
    .single();

  if (channelError) {
    console.error("Error creating group channel:", channelError);
    return { error: "Lỗi tạo kênh chat: " + channelError.message };
  }

  const { data: group, error } = await supabase
    .from("study_groups")
    .insert({
      leader_id: user.id,
      name: validated.data.name,
      description: validated.data.description,
      channel_id: channel.id
    })
    .select()
    .single();

  if (error) return { error: error.message };

  // Prepare members to insert (Leader + Invited Members)
  const membersToInsert = [
    { group_id: group.id, user_id: user.id }, // Leader
    ...memberIds.map(uid => ({ group_id: group.id, user_id: uid })) // Invited
  ];

  // Insert all members (ignore duplicates if any)
  const { error: memberError } = await supabase
    .from("study_group_members")
    .insert(membersToInsert)
    .select(); // select to avoid error if silent

  if (memberError) {
      console.error("Error adding members:", memberError);
      // We don't return error here because group is created, just warn or ignore
  }

  revalidatePath("/dashboard/groups");
  return { success: true };
}

export async function joinGroup(groupId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase.from("study_group_members").insert({
    group_id: groupId,
    user_id: user.id
  });

  if (error) {
    if (error.code === "23505") return { error: "Bạn đã tham gia nhóm này rồi!" };
    return { error: error.message };
  }

  revalidatePath("/dashboard/groups");
  return { success: true };
}

export async function leaveGroup(groupId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: group } = await supabase
    .from("study_groups")
    .select("leader_id")
    .eq("id", groupId)
    .single();

  if (group?.leader_id === user.id)
    return { error: "Bạn là leader của nhóm, không thể rời nhóm." };

  const { error } = await supabase
    .from("study_group_members")
    .delete()
    .eq("group_id", groupId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/groups");
  revalidatePath(`/dashboard/groups/${groupId}`);
  return { success: true };
}

export async function postAnnouncement(groupId: string, content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: membership } = await supabase
    .from("study_group_members")
    .select("user_id")
    .eq("group_id", groupId)
    .eq("user_id", user.id)
    .single();

  if (!membership) return { error: "Bạn chưa tham gia nhóm này." };

  const { error } = await supabase.from("group_announcements").insert({
    group_id: groupId,
    author_id: user.id,
    content: content.trim(),
  });

  if (error) return { error: error.message };

  revalidatePath(`/dashboard/groups/${groupId}`);
  return { success: true };
}

export async function addGroupSession(groupId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const topic = formData.get("topic") as string;
  const startTime = formData.get("start_time") as string;
  const location = formData.get("location") as string;

  if (!topic || !startTime) return { error: "Vui lòng điền đủ thông tin." };

  const { error } = await supabase.from("group_sessions").insert({
    group_id: groupId,
    created_by: user.id,
    topic: topic.trim(),
    start_time: startTime,
    location: location?.trim() || null,
  });

  if (error) return { error: error.message };

  revalidatePath(`/dashboard/groups/${groupId}`);
  revalidatePath("/dashboard");
  return { success: true };
}

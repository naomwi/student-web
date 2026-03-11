"use server";

import { createClient } from "@/lib/supabase/server";

export async function getChannels(userId: string) {
  const supabase = await createClient();

  // 1. Get Global Channel
  const { data: globalChannels } = await supabase
    .from("channels")
    .select("*")
    .eq("type", "global");

  // 2. Get Group Channels via user's group memberships
  const { data: memberGroups } = await supabase
    .from("study_group_members")
    .select("study_groups(id, name, channel_id)")
    .eq("user_id", userId);

  const groupChannels = (memberGroups || [])
    .map((m: any) => m.study_groups)
    .filter((g: any) => g?.channel_id)
    .map((g: any) => ({
      id: g.channel_id,
      name: g.name,
      type: "group" as const,
    }));

  // 3. Get DM Channels
  const { data: dmMemberships } = await supabase
    .from("channel_members")
    .select("channel_id, channels!inner(*)")
    .eq("user_id", userId)
    .eq("channels.type", "dm");

  const dmChannelIds = dmMemberships?.map(m => m.channel_id) || [];

  let formattedDMs: any[] = [];
  if (dmChannelIds.length > 0) {
    // Fetch the *other* member for each DM channel to get the name
    const { data: otherMembers } = await supabase
      .from("channel_members")
      .select("channel_id, profiles(full_name, avatar_url)")
      .in("channel_id", dmChannelIds)
      .neq("user_id", userId);

    formattedDMs = (dmMemberships || []).map(m => {
      const otherMember = otherMembers?.find(om => om.channel_id === m.channel_id);
      const profiles = otherMember?.profiles as any;

      // Supabase returns profiles as a single object on 1-to-1 joins, not an array
      const profileData = Array.isArray(profiles) ? profiles[0] : profiles;

      return {
        id: m.channel_id,
        type: "dm",
        name: profileData?.full_name || "Người dùng",
        avatar_url: profileData?.avatar_url
      };
    });
  }

  return {
    global: globalChannels || [],
    groups: groupChannels || [],
    dms: formattedDMs,
  };
}

export async function createDM(targetUserId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };
  if (user.id === targetUserId) return { error: "Không thể chat với chính mình" };

  // Use Secure RPC to get or create DM channel
  // This avoids RLS "policy violation" errors when inserting a channel before membership exists
  const { data: channelId, error } = await supabase.rpc('create_dm_secure', {
    target_user_id: targetUserId
  });

  if (error) {
    console.error("Error creating DM:", error);
    return { error: "Lỗi tạo hội thoại: " + error.message };
  }

  return { id: channelId };
}

export async function searchUsers(query: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, username, avatar_url, email")
    .or(`full_name.ilike.%${query}%,username.ilike.%${query}%`)
    .neq("id", user.id) // Exclude self
    .limit(5);

  return data || [];
}

export async function getMessages(channelId: string) {
  const supabase = await createClient();

  const { data: messages } = await supabase
    .from("messages")
    .select("*, profiles(full_name, avatar_url)")
    .eq("channel_id", channelId)
    .order("created_at", { ascending: true });

  return messages || [];
}

export async function sendMessage(channelId: string, content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("messages")
    .insert({
      channel_id: channelId,
      user_id: user.id,
      content: content
    });

  if (error) return { error: error.message };
  return { success: true };
}

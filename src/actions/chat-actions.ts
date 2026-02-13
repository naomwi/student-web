"use server";

import { createClient } from "@/lib/supabase/server";

export async function getChannels(userId: string) {
  const supabase = await createClient();

  // 1. Get Global Channel
  const { data: globalChannels } = await supabase
    .from("channels")
    .select("*")
    .eq("type", "global");

  // 2. Get Group Channels (where user is member of the group)
  const { data: groupChannels } = await supabase
    .from("channels")
    .select("*, study_groups!inner(study_group_members!inner(user_id))")
    .eq("type", "group")
    .eq("study_groups.study_group_members.user_id", userId);

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
        const profile = (otherMember?.profiles as any)?.[0] || (otherMember?.profiles as any); // Handle both array or single object just in case, but prioritize array access as requested
        
        // Strictly following user instruction to access as array [0]
        const profileName = Array.isArray(otherMember?.profiles) 
            ? otherMember?.profiles[0]?.full_name 
            : (otherMember?.profiles as any)?.full_name;

        return {
           id: m.channel_id,
           type: "dm",
           name: (otherMember?.profiles as any)?.[0]?.full_name || "Người dùng",
           avatar_url: (otherMember?.profiles as any)?.[0]?.avatar_url
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

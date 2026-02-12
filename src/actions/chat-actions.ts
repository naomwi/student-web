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

  // Check if DM exists
  // Logic: Find a channel of type 'dm' where both users are members
  // This is complex in SQL/Supabase, simplified approach:
  // Get all my DM channels, then check if targetUser is in any of them
  const { data: myDMs } = await supabase
     .from("channel_members")
     .select("channel_id, channels!inner(type)")
     .eq("user_id", user.id)
     .eq("channels.type", "dm");
  
  const myDMIds = myDMs?.map(d => d.channel_id) || [];
  
  if (myDMIds.length > 0) {
     const { data: existingDM } = await supabase
        .from("channel_members")
        .select("channel_id")
        .in("channel_id", myDMIds)
        .eq("user_id", targetUserId)
        .maybeSingle();
     
     if (existingDM) return { id: existingDM.channel_id };
  }

  // Create new DM
  const { data: newChannel, error: createError } = await supabase
     .from("channels")
     .insert({ type: "dm" })
     .select()
     .single();

  if (createError) return { error: createError.message };

  // Add members
  const { error: memberError } = await supabase
     .from("channel_members")
     .insert([
        { channel_id: newChannel.id, user_id: user.id },
        { channel_id: newChannel.id, user_id: targetUserId }
     ]);

  if (memberError) return { error: memberError.message };
  
  return { id: newChannel.id };
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

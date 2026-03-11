import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { GroupDetailClient } from "@/components/groups/group-detail-client";

export default async function GroupDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: group } = await supabase
    .from("study_groups")
    .select("*")
    .eq("id", id)
    .single();

  if (!group) return <div>Nhóm không tồn tại.</div>;

  const { data: members } = await supabase
    .from("study_group_members")
    .select("id, user_id, joined_at, profiles(full_name)")
    .eq("group_id", id);

  const { data: sessions } = await supabase
    .from("group_sessions")
    .select("*, profiles(full_name)")
    .eq("group_id", id)
    .order("start_time", { ascending: true });

  const { data: announcements } = await supabase
    .from("group_announcements")
    .select("*, profiles(full_name, avatar_url)")
    .eq("group_id", id)
    .order("created_at", { ascending: false });

  const isMember = members?.some((m) => m.user_id === user.id) ?? false;
  const isLeader = group.leader_id === user.id;

  return (
    <GroupDetailClient 
      group={group} 
      members={members || []} 
      sessions={sessions || []}
      announcements={announcements || []}
      currentUserInfo={{ isMember, isLeader, id: user.id }} 
    />
  );
}
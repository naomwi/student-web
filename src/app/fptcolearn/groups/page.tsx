import { createClient } from "@/lib/supabase/server";
import GroupsPageClient from "@/components/groups/groups-page-client";

export default async function GroupsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch groups
  const { data: groups } = await supabase
    .from("study_groups")
    .select("*, study_group_members(user_id)")
    .order("created_at", { ascending: false });

  // Transform data to include member count and isMember status
  const formattedGroups = groups?.map(group => ({
    ...group,
    memberCount: group.study_group_members.length,
    isMember: group.study_group_members.some((m: any) => m.user_id === user?.id),
  })) || [];

  return <GroupsPageClient groups={formattedGroups} />;
}

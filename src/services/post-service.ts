import { createClient } from "@/lib/supabase/server";

export async function getPostsService() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      profiles (name: full_name, avatar_url),
      comments (count)
    `)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  
  return data;
}

export async function getProfileService(userId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) return null;
  return data;
}

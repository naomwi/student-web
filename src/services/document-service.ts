import { createClient } from "@/lib/supabase/server";

export async function getDocumentsService(search?: string, category?: string) {
  const supabase = await createClient();
  
  let query = supabase
    .from("documents")
    .select("*, profiles(full_name)")
    .order("created_at", { ascending: false });

  if (search) {
    query = query.ilike("file_name", `%${search}%`);
  }

  if (category && category !== "all") {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  
  if (error) {
    console.error("Error fetching docs:", error);
    return [];
  }

  return data;
}

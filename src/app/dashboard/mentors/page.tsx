import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import Link from "next/link";
import { MentorCard } from "@/components/mentors/mentor-card";

export default async function MentorsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch Mentors
  const { data: mentors } = await supabase
    .from("profiles")
    .select("*")
    .eq("is_mentor", true);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100 tracking-tight">Cố vấn học tập (Mentors)</h2>
           <p className="text-slate-500 mt-2">Kết nối với các anh chị khóa trên để được hướng dẫn.</p>
        </div>
        <Link href="/dashboard/settings">
            <Button variant="outline">Đăng ký làm Mentor</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mentors?.map((mentor) => (
          <MentorCard key={mentor.id} mentor={mentor} currentUserId={user?.id || ""} />
        ))}

        {mentors?.length === 0 && (
            <div className="col-span-full text-center py-12">
                <User className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500">Chưa có Mentor nào đăng ký.</p>
            </div>
        )}
      </div>
    </div>
  );
}

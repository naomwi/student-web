import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { BookOpen, FileText, Users, Calendar, Activity, ShieldAlert, Sparkles, ArrowUpRight, SearchX, MapPin } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Leaderboard } from "@/components/dashboard/leaderboard";
import { StatCard } from "@/components/shared/stat-card";
import { SectionHeader } from "@/components/shared/section-header";
import { EmptyState } from "@/components/shared/empty-state";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const isAdmin = profile?.role === 'admin';

  const [
    { count: postCount },
    { count: docCount },
    { count: groupCount },
  ] = await Promise.all([
    supabase.from("posts").select("*", { count: "exact", head: true }).eq("author_id", user.id),
    supabase.from("documents").select("*", { count: "exact", head: true }).eq("uploader_id", user.id),
    supabase.from("study_group_members").select("*", { count: "exact", head: true }).eq("user_id", user.id),
  ]);

  let reports = [];
  if (isAdmin) {
    const { data } = await supabase.from("reports").select("*, reporter:profiles!reporter_id(full_name)").eq("status", "pending").limit(5);
    reports = data || [];
  }

  // Fetch upcoming sessions from groups user is in
  const { data: upcomingSessions } = await supabase
    .from("group_sessions")
    .select("*, study_groups!inner(name)")
    .gte("start_time", new Date().toISOString())
    .order("start_time", { ascending: true })
    .limit(3);
  // Optional: RLS handles filtering if setup correctly, else need a custom join query or RPC.
  // Assuming RLS policy handles "members can read" for group_sessions.

  return (
    <div className="space-y-10 pb-10">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
        <div className="w-full">
          <h2 className="text-4xl font-display font-bold tracking-tight mb-2 bg-gradient-to-r from-[#0D9488] via-[#2DD4BF] to-indigo-400 bg-clip-text text-transparent">
            Tổng quan
          </h2>
          <div className="mt-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-teal-50 to-indigo-50 dark:from-teal-900/20 dark:to-indigo-900/20 border border-teal-100 dark:border-teal-900/30 flex items-center gap-3 w-fit">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Chào mừng trở lại! Chúc bạn một ngày học tập bùng nổ 🚀
            </p>
          </div>
        </div>
        {isAdmin && (
          <span className="bg-rose-50 text-rose-600 border border-rose-100 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-sm shrink-0">
            <ShieldAlert className="h-4 w-4" strokeWidth={1.5} /> ADMIN MODE
          </span>
        )}
      </div>

      {/* BENTO GRID STATS */}
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="Bài viết đã đăng"
          value={postCount || 0}
          icon={<BookOpen className="h-6 w-6 text-white" strokeWidth={1.5} />}
          desc="Kiến thức lan tỏa"
          gradient="violet"
        />
        <StatCard
          title="Tài liệu chia sẻ"
          value={docCount || 0}
          icon={<FileText className="h-6 w-6 text-white" strokeWidth={1.5} />}
          desc="Tài nguyên đóng góp"
          gradient="teal"
        />
        <StatCard
          title="Nhóm tham gia"
          value={groupCount || 0}
          icon={<Users className="h-6 w-6 text-white" strokeWidth={1.5} />}
          desc="Cộng đồng kết nối"
          gradient="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* LEFT COLUMN (8/12) */}
        <div className="lg:col-span-8 space-y-8">

          {/* Upcoming Sessions Card */}
          <div className="bg-white dark:bg-[#1a2332] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden group">
            <SectionHeader 
              icon={<Calendar className="h-5 w-5" strokeWidth={1.5} />} 
              title="Lịch học sắp tới" 
              href="/dashboard/groups" 
              label="Xem tất cả nhóm" 
            />
            <div className="p-8 pt-0">
              {!upcomingSessions || upcomingSessions.length === 0 ? (
                <EmptyState 
                  icon={<SearchX className="h-12 w-12 text-slate-300" />} 
                  message="Lịch trình đang trống. Hãy vào nhóm và lên lịch học ngay!" 
                  actionLabel="Vào nhóm học tập" 
                  actionHref="/dashboard/groups" 
                />
              ) : (
                <div className="space-y-4">
                  {upcomingSessions.map((session: any) => (
                    <div key={session.id} className="flex items-center justify-between p-5 bg-white dark:bg-slate-800 rounded-2xl border-l-4 border-l-[#2DD4BF] shadow-[inset_0_0_0_1px_rgba(45,212,191,0.08)] border-y border-r border-slate-200 dark:border-y-slate-700 dark:border-r-slate-700 hover:border-l-[#0D9488] hover:shadow-md transition duration-300">
                      <div>
                        <p className="text-xs font-bold text-[#0D9488] dark:text-[#2DD4BF] uppercase tracking-wider mb-1">{session.study_groups?.name}</p>
                        <p className="font-bold text-[#1a2332] dark:text-slate-200 text-lg font-display mb-1">{session.topic}</p>
                        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 font-medium font-body mt-2">
                          <span className="flex items-center">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 shadow-[0_0_8px_rgba(52,211,153,0.6)]"></span>
                            {new Date(session.start_time).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}
                          </span>
                          {session.location && (
                            <span className="flex items-center">
                              <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                              {session.location}
                            </span>
                          )}
                        </div>
                      </div>
                      <Link href={`/dashboard/groups/${session.group_id}`}>
                        <Button variant="ghost" className="text-sm bg-[#0D9488]/10 dark:bg-[#0D9488]/20 text-[#0D9488] dark:text-[#2DD4BF] px-5 py-2.5 rounded-xl hover:bg-[#0D9488]/20 dark:hover:bg-[#0D9488]/30 font-semibold transition font-body h-auto">
                          Vào nhóm <ArrowUpRight className="ml-1 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Report Section */}
          {isAdmin && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-rose-100 dark:border-rose-900/30 shadow-xl shadow-rose-100/50 dark:shadow-none overflow-hidden">
              <SectionHeader 
                icon={<ShieldAlert className="h-5 w-5 text-rose-600 dark:text-rose-400" strokeWidth={1.5} />} 
                title="Báo cáo cần xử lý" 
              />
              <div className="p-6 pt-0 font-body">
                {reports.length === 0 ? <p className="text-emerald-600 font-medium text-center">Sạch bóng vi phạm!</p> : <p>Có {reports.length} báo cáo.</p>}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN (4/12) */}
        <div className="lg:col-span-4 space-y-8">

          <Leaderboard />

          <div className="bg-gradient-to-b from-[#1a2332] to-[#0D9488] rounded-3xl p-1 shadow-2xl shadow-teal-500/20 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#2DD4BF]/20 rounded-full blur-xl -ml-10 -mb-10"></div>

            <div className="bg-white/10 backdrop-blur-sm rounded-[20px] p-6 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Activity className="h-5 w-5 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="font-bold text-lg font-display">Hoạt động mới</h3>
              </div>

              <div className="space-y-6 relative z-10 font-body">
                <div className="flex gap-4">
                  <div className="flex-col items-center hidden sm:flex">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_10px_#34d399]"></div>
                    <div className="w-0.5 h-full bg-white/20 mt-2"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-teal-50 leading-relaxed">
                      Chào mừng bạn đến với <span className="text-white font-bold">UniConnect</span>.
                    </p>
                    <span className="text-xs text-teal-200 mt-1 block">Vừa xong</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

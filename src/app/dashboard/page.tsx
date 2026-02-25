import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, Users, Calendar, Activity, ShieldAlert, Sparkles, Trophy, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Leaderboard } from "@/components/dashboard/leaderboard";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch Data (Giữ nguyên logic cũ)
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

  const { data: upcomingGroups } = await supabase.from("study_group_members").select("study_groups(name, meeting_link, location)").eq("user_id", user.id).limit(3);

  return (
    <div className="space-y-10 pb-10">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-serif font-bold text-slate-900 dark:text-white tracking-tight mb-2">
            Tổng quan
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" strokeWidth={1.5} />
            Chào mừng trở lại, chúc bạn một ngày bùng nổ năng lượng!
          </p>
        </div>
        {isAdmin && (
          <span className="bg-rose-50 text-rose-600 border border-rose-100 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-sm">
            <ShieldAlert className="h-4 w-4" strokeWidth={1.5} /> ADMIN MODE
          </span>
        )}
      </div>

      {/* BENTO GRID STATS */}
      <div className="grid gap-6 md:grid-cols-3">
        <StatsCard
          title="Bài viết đã đăng"
          value={postCount || 0}
          icon={<BookOpen className="h-6 w-6 text-white" strokeWidth={1.5} />}
          desc="Kiến thức lan tỏa"
          gradient="from-indigo-500 to-violet-600 dark:from-indigo-900 dark:to-violet-950"
          pattern="bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" // Giả lập noise texture nếu có
        />
        <StatsCard
          title="Tài liệu chia sẻ"
          value={docCount || 0}
          icon={<FileText className="h-6 w-6 text-white" strokeWidth={1.5} />}
          desc="Tài nguyên đóng góp"
          gradient="from-emerald-400 to-teal-600 dark:from-emerald-900 dark:to-teal-950"
          pattern=""
        />
        <StatsCard
          title="Nhóm tham gia"
          value={groupCount || 0}
          icon={<Users className="h-6 w-6 text-white" strokeWidth={1.5} />}
          desc="Cộng đồng kết nối"
          gradient="from-orange-400 to-rose-500 dark:from-orange-900 dark:to-rose-950"
          pattern=""
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* LEFT COLUMN (8/12) */}
        <div className="lg:col-span-8 space-y-8">

          {/* Upcoming Groups Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden group">
            <div className="p-8 border-b border-slate-50 dark:border-white/5 flex justify-between items-center bg-gradient-to-r from-slate-50/50 dark:from-white/5 dark:to-transparent">
              <h3 className="font-serif font-bold text-xl text-slate-800 dark:text-slate-200 flex items-center">
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-500/20 rounded-xl mr-4 border border-indigo-100 dark:border-indigo-500/30">
                  <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" strokeWidth={1.5} />
                </div>
                Lịch học sắp tới
              </h3>
              <Link href="/dashboard/groups">
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 gap-1">
                  Xem tất cả <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
                </Button>
              </Link>
            </div>
            <div className="p-8">
              {upcomingGroups?.length === 0 ? (
                <div className="text-center py-12 bg-slate-50/50 dark:bg-[#1a1a1a] rounded-2xl border border-dashed border-slate-200 dark:border-white/10">
                  <p className="text-slate-400 text-sm mb-4">Lịch trình đang trống...</p>
                  <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none">
                    Tìm nhóm ngay
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingGroups?.map((item: any, idx) => (
                    <div key={idx} className="flex items-center justify-between p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:shadow-md transition duration-300">
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200 text-lg">{item.study_groups?.name}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1 flex items-center">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 shadow-[0_0_8px_rgba(52,211,153,0.6)]"></span>
                          {item.study_groups?.location}
                        </p>
                      </div>
                      {item.study_groups?.meeting_link && (
                        <a href={item.study_groups.meeting_link} target="_blank" className="text-sm bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 px-5 py-2.5 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-500/30 font-semibold transition">
                          Vào lớp
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Report Section */}
          {isAdmin && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-rose-100 dark:border-rose-900/30 shadow-xl shadow-rose-100/50 dark:shadow-none overflow-hidden">
              <div className="p-6 border-b border-rose-50 dark:border-rose-900/20 bg-rose-50/30 dark:bg-rose-900/10">
                <h3 className="font-bold text-rose-800 dark:text-rose-400 flex items-center text-lg">
                  <ShieldAlert className="h-5 w-5 mr-3 text-rose-600 dark:text-rose-400" strokeWidth={1.5} />
                  Báo cáo cần xử lý
                </h3>
              </div>
              <div className="p-6">
                {/* Logic cũ render reports */}
                {reports.length === 0 ? <p className="text-emerald-600 font-medium text-center">Sạch bóng vi phạm!</p> : <p>Có {reports.length} báo cáo.</p>}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN (4/12) */}
        <div className="lg:col-span-4 space-y-8">

          <Leaderboard />

          <div className="bg-gradient-to-b from-indigo-600 to-purple-700 rounded-3xl p-1 shadow-2xl shadow-indigo-200 text-white overflow-hidden relative">
            {/* Abstract Shapes Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-rose-500/20 rounded-full blur-xl -ml-10 -mb-10"></div>

            <div className="bg-white/10 backdrop-blur-sm rounded-[20px] p-6 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Activity className="h-5 w-5 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="font-bold text-lg">Hoạt động mới</h3>
              </div>

              <div className="space-y-6 relative z-10">
                <div className="flex gap-4">
                  <div className="flex-col items-center hidden sm:flex">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_10px_#34d399]"></div>
                    <div className="w-0.5 h-full bg-white/20 mt-2"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-indigo-100 leading-relaxed">
                      Chào mừng bạn đến với <span className="text-white font-bold">UniConnect</span>.
                    </p>
                    <span className="text-xs text-indigo-300 mt-1 block">Vừa xong</span>
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

function StatsCard({ title, value, icon, desc, gradient, pattern }: { title: string, value: number, icon: any, desc: string, gradient: string, pattern: string }) {
  return (
    <Card className={`border-none shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden bg-gradient-to-br ${gradient}`}>

      {/* Decorative Circles */}
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
      <div className="absolute -left-6 -bottom-6 w-20 h-20 bg-black/5 rounded-full blur-xl"></div>

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 z-10 relative">
        <CardTitle className="text-sm font-medium text-white/80">{title}</CardTitle>
        <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm border border-white/10 shadow-inner">
          {icon}
        </div>
      </CardHeader>
      <CardContent className="z-10 relative">
        <div className="text-4xl font-serif font-bold text-white mt-2 mb-1">{value}</div>
        <p className="text-xs font-medium text-white/60">{desc}</p>
      </CardContent>
    </Card>
  )
}

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookOpen, FileText, Users, LogOut, LayoutGrid, Settings, MessageCircleQuestion, GraduationCap, HelpCircle, UserCheck, Map } from "lucide-react";
import { UserNav } from "@/components/dashboard/user-nav";
import { ChatWidget } from "@/components/chat/chat-widget";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url, username")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex min-h-screen bg-slate-50/50 dark:bg-slate-900/50">
      {/* GLASS SIDEBAR */}
      <aside className="w-72 fixed inset-y-0 z-30 hidden md:flex flex-col bg-white dark:bg-slate-900 m-4 rounded-3xl border border-slate-200/60 dark:border-white/10 shadow-xl backdrop-blur-xl">
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-gradient-to-tr from-indigo-600 to-rose-500 p-2.5 rounded-xl shadow-lg shadow-indigo-200">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-slate-800 dark:text-slate-200 tracking-tight">UniConnect</h2>
          </div>

          <div className="space-y-1">
            <NavItem href="/dashboard" icon={<LayoutGrid />}>Tổng quan</NavItem>
            <NavItem href="/dashboard/blog" icon={<BookOpen />}>Học thuật (Blog)</NavItem>
            <NavItem href="/dashboard/documents" icon={<FileText />}>Tài nguyên</NavItem>
            <NavItem href="/dashboard/exams" icon={<GraduationCap />}>Ngân hàng Đề thi</NavItem>
            <NavItem href="/dashboard/roadmap" icon={<Map />}>Lộ trình học tập</NavItem>
            <NavItem href="/dashboard/qa" icon={<MessageCircleQuestion />}>Hỏi đáp</NavItem>
            <NavItem href="/dashboard/mentors" icon={<UserCheck />}>Cố vấn (Mentors)</NavItem>
            <NavItem href="/dashboard/groups" icon={<Users />}>Cộng đồng</NavItem>
            <NavItem href="/dashboard/faq" icon={<HelpCircle />}>Hỗ trợ & FAQ</NavItem>
          </div>
        </div>

        <div className="mt-auto p-8 pt-0">
          <NavItem href="/dashboard/settings" icon={<Settings />}>Cài đặt</NavItem>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <form action="/auth/signout" method="post">
              <button className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all duration-200">
                <LogOut className="h-5 w-5" />
                <span>Đăng xuất</span>
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 min-w-0 md:ml-[320px] p-4 md:p-8 min-h-screen flex flex-col max-w-full overflow-hidden">
        {/* HEADER */}
        <header className="flex justify-between items-center mb-10 relative z-40 shrink-0">
          <div className="min-w-0 flex-1 mr-4">
            <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100 truncate">
              Xin chào, {user.user_metadata.full_name || profile?.full_name?.split(' ').pop()}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 truncate">Hôm nay bạn muốn học điều gì?</p>
          </div>

          <div className="flex items-center gap-4">
            <UserNav user={{
              email: user.email || "",
              full_name: profile?.full_name || user.user_metadata.full_name,
              avatar_url: profile?.avatar_url || user.user_metadata.avatar_url,
              username: profile?.username
            }} />
          </div>
        </header>

        {/* CONTENT */}
        <div className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </main>

      <ChatWidget userId={user.id} />
    </div>
  );
}

function NavItem({ href, children, icon }: { href: string; children: React.ReactNode; icon: any }) {
  return (
    <Link href={href} className="group flex items-center gap-3 px-4 py-3.5 text-slate-600 dark:text-slate-300 hover:text-indigo-700 dark:hover:text-indigo-400 hover:bg-indigo-50/80 dark:hover:bg-indigo-900/30 rounded-xl transition-all duration-200 mb-1">
      <span className="h-5 w-5 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{icon}</span>
      <span className="font-medium text-[15px]">{children}</span>
    </Link>
  );
}
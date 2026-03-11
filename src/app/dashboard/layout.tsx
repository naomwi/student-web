import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { UserNav } from "@/components/dashboard/user-nav";
import { ChatWidget } from "@/components/chat/chat-widget";
import { ModeToggle } from "@/components/mode-toggle";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";

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
    <div className="flex min-h-screen bg-[#F0FDFA] dark:bg-[#1a2332]/50 font-body">
      {/* SIDEBAR */}
      <SidebarNav />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 min-w-0 md:ml-[320px] p-4 md:p-8 min-h-screen flex flex-col max-w-full overflow-hidden">
        {/* HEADER */}
        <header className="flex justify-between items-center mb-10 relative z-30 shrink-0">
          <div className="min-w-0 flex-1 mr-4 md:pl-0 pl-12">
            <h1 className="text-3xl font-display font-bold text-[#1a2332] dark:text-slate-100 truncate">
              Xin chào, {user.user_metadata.full_name || profile?.full_name?.split(' ').pop()}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 truncate">Hôm nay bạn muốn học điều gì?</p>
          </div>

          <div className="flex items-center gap-4">
            <ModeToggle />
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

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, FileText, Users, LayoutGrid, Settings, MessageCircleQuestion, GraduationCap, HelpCircle, UserCheck, Map, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GlobalSearch } from "./global-search";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Tổng quan", icon: LayoutGrid },
  { href: "/dashboard/blog", label: "Học thuật (Blog)", icon: BookOpen },
  { href: "/dashboard/documents", label: "Tài nguyên", icon: FileText },
  { href: "/dashboard/exams", label: "Ngân hàng Đề thi", icon: GraduationCap },
  { href: "/dashboard/roadmap", label: "Lộ trình học tập", icon: Map },
  { href: "/dashboard/qa", label: "Hỏi đáp", icon: MessageCircleQuestion },
  { href: "/dashboard/mentors", label: "Cố vấn (Mentors)", icon: UserCheck },
  { href: "/dashboard/groups", label: "Nhóm học tập", icon: Users },
  { href: "/dashboard/faq", label: "Hỗ trợ & FAQ", icon: HelpCircle },
];

export function SidebarNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const NavContent = () => (
    <>
      <div className="p-8 pb-4">
        <Link href="/dashboard" className="flex items-center gap-3 mb-8 hover:opacity-90 transition-opacity" onClick={() => setIsOpen(false)}>
          <div className="bg-gradient-to-tr from-[#0D9488] to-[#2DD4BF] p-2.5 rounded-xl shadow-lg shadow-teal-500/20">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-display font-bold text-white tracking-tight">UniConnect</h2>
        </Link>

        <GlobalSearch />

        <div className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                onClick={() => setIsOpen(false)}
                className={`group flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 mb-1 font-body text-[15px]
                  ${isActive 
                    ? "bg-[#0D9488]/20 text-[#2DD4BF] border-l-4 border-[#2DD4BF]" 
                    : "text-slate-300 hover:text-[#2DD4BF] hover:bg-[#0D9488]/10 border-l-4 border-transparent"
                  }`}
              >
                <Icon className={`h-5 w-5 transition-colors ${isActive ? "text-[#2DD4BF]" : "text-slate-400 group-hover:text-[#2DD4BF]"}`} />
                <span className={isActive ? "font-bold" : "font-semibold"}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-auto p-8 pt-0">
        <Link 
          href="/dashboard/settings" 
          onClick={() => setIsOpen(false)}
          className={`group flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 mb-1 font-body text-[15px]
            ${pathname === '/dashboard/settings'
              ? "bg-[#0D9488]/20 text-[#2DD4BF] border-l-4 border-[#2DD4BF]" 
              : "text-slate-300 hover:text-[#2DD4BF] hover:bg-[#0D9488]/10 border-l-4 border-transparent"
            }`}
        >
          <Settings className={`h-5 w-5 transition-colors ${pathname === '/dashboard/settings' ? "text-[#2DD4BF]" : "text-slate-400 group-hover:text-[#2DD4BF]"}`} />
          <span className={pathname === '/dashboard/settings' ? "font-bold" : "font-semibold"}>Cài đặt</span>
        </Link>

        <div className="mt-4 pt-4 border-t border-slate-700/50">
          <form action="/auth/signout" method="post">
            <button className="flex w-full items-center gap-3 px-4 py-3 text-[15px] font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-xl transition-all duration-200 font-body border-l-4 border-transparent">
              <LogOut className="h-5 w-5" />
              <span>Đăng xuất</span>
            </button>
          </form>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Toggle Button (Rendered outside sidebar on mobile) */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={() => setIsOpen(!isOpen)} className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          {isOpen ? <X className="h-5 w-5 text-[#1a2332] dark:text-white" /> : <Menu className="h-5 w-5 text-[#1a2332] dark:text-white" />}
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="w-72 fixed inset-y-0 z-40 hidden md:flex flex-col bg-[#1a2332] m-4 rounded-3xl shadow-xl">
        <NavContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <aside className="w-72 max-w-[80vw] h-full bg-[#1a2332] flex flex-col shadow-2xl relative z-50 overflow-y-auto">
            <NavContent />
          </aside>
        </div>
      )}
    </>
  );
}

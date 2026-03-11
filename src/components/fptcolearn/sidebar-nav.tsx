"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, FileText, Users, LayoutGrid, Settings, MessageCircleQuestion, GraduationCap, HelpCircle, UserCheck, Map, LogOut, Menu, X, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GlobalSearch } from "./global-search";
import { useUser } from "@/context/user-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

const NAV_ITEMS = [
  { href: "/fptcolearn", label: "Tổng quan", icon: LayoutGrid },
  { href: "/fptcolearn/blog", label: "Học thuật (Blog)", icon: BookOpen },
  { href: "/fptcolearn/documents", label: "Tài nguyên", icon: FileText },
  { href: "/fptcolearn/exams", label: "Ngân hàng Đề thi", icon: GraduationCap },
  { href: "/fptcolearn/roadmap", label: "Lộ trình học tập", icon: Map },
  { href: "/fptcolearn/qa", label: "Hỏi đáp", icon: MessageCircleQuestion },
  { href: "/fptcolearn/mentors", label: "Cố vấn (Mentors)", icon: UserCheck },
  { href: "/fptcolearn/groups", label: "Nhóm học tập", icon: Users },
  { href: "/fptcolearn/faq", label: "Hỗ trợ & FAQ", icon: HelpCircle },
];

export function SidebarNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { user, tier } = useUser();

  const NavContent = () => (
    <>
      <div className="p-8 pb-4">
        <div className="flex items-center justify-between mb-8">
          <Link href="/fptcolearn" className="flex items-center gap-3 hover:opacity-90 transition-opacity" onClick={() => setIsOpen(false)}>
            <div className="bg-gradient-to-tr from-[#0D9488] to-[#2DD4BF] p-2.5 rounded-xl shadow-lg shadow-teal-500/20">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-display font-bold text-white tracking-tight">FPTcolearn</h2>
          </Link>
          
          {/* Small Top Avatar (Desktop Only) */}
          <div className="hidden md:block">
            <Link href="/fptcolearn/settings" title="Cài đặt tài khoản">
              <Avatar className="h-8 w-8 border border-slate-700 hover:border-[#2DD4BF] transition-colors cursor-pointer">
                <AvatarImage src={user.avatar_url || ""} />
                <AvatarFallback className="bg-slate-800 text-slate-300 text-xs">
                  {user.full_name?.charAt(0) || <User size={14} />}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>

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
                className={`group flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 mb-1 font-body text-base tracking-wide
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

      {/* Bottom User Card / Dropdown Area */}
      <div className="mt-auto p-6 pt-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 cursor-pointer transition-all duration-200 mb-4 font-body group">
              <Avatar className="h-10 w-10 border border-slate-600 shadow-sm group-hover:border-[#2DD4BF] transition-colors">
                <AvatarImage src={user.avatar_url || ""} />
                <AvatarFallback className="bg-slate-700 text-white font-bold">
                  {user.full_name?.charAt(0) || <User size={18} />}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate group-hover:text-[#2DD4BF] transition-colors">{user.full_name}</p>
                <p className="text-[11px] font-medium text-slate-400 flex items-center mt-0.5 truncate">
                  <span className="mr-1" title={tier.name}>{tier.emoji}</span> {tier.name} <span className="mx-1">•</span> <span className="text-[#2DD4BF] font-bold">{user.reputation}pt</span>
                </p>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-[#1a2332] border-slate-800 text-slate-300 rounded-xl shadow-2xl p-2 font-body">
             <Link href="/fptcolearn/settings" onClick={() => setIsOpen(false)}>
               <DropdownMenuItem className="cursor-pointer hover:bg-slate-800 hover:text-white rounded-lg py-2.5">
                 <User className="mr-2 h-4 w-4" /> <span>Xem hồ sơ & Cài đặt</span>
               </DropdownMenuItem>
             </Link>
             <DropdownMenuSeparator className="bg-slate-800 my-1" />
             <form action="/auth/signout" method="post" className="w-full">
               <button type="submit" className="w-full">
                 <DropdownMenuItem className="cursor-pointer text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-lg py-2.5 focus:bg-rose-500/10 focus:text-rose-300">
                   <LogOut className="mr-2 h-4 w-4" /> <span className="font-bold">Đăng xuất</span>
                 </DropdownMenuItem>
               </button>
             </form>
          </DropdownMenuContent>
        </DropdownMenu>
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

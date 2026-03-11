"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Users, Calendar, Megaphone, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { leaveGroup } from "@/actions/group-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AnnouncementsPanel } from "./announcements-panel";
import { SessionsPanel } from "./sessions-panel";

export function GroupDetailClient({ group, members, sessions, announcements, currentUserInfo }: any) {
  const [activeTab, setActiveTab] = useState<"sessions" | "announcements" | "members">("sessions");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLeaveGroup = () => {
    startTransition(async () => {
      const res = await leaveGroup(group.id);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Đã rời nhóm.");
        router.push("/dashboard/groups");
      }
    });
  };

  const tabs = [
    { id: "sessions", label: "Lịch học", icon: Calendar },
    { id: "announcements", label: "Thông báo", icon: Megaphone },
    { id: "members", label: `Thành viên (${members.length})`, icon: Users },
  ] as const;

  return (
    <div className="space-y-6 font-body pb-20">
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2">
        <Link href="/dashboard/groups" className="hover:text-[#0D9488] dark:hover:text-[#2DD4BF] transition flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" /> Quay lại nhóm
        </Link>
      </div>

      <div className="bg-white dark:bg-[#1a2332] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#0D9488]/10 to-transparent rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        
        <div className="p-8 md:p-10 relative z-10 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-[#1a2332] dark:text-white tracking-tight mb-4">
                {group.name}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 max-w-2xl text-lg leading-relaxed">
                {group.description || "Chưa có mô tả."}
              </p>
              
              <div className="flex items-center gap-4 mt-6">
                <div className="flex items-center bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300">
                  <MapPin className="h-4 w-4 mr-2 text-[#0D9488] dark:text-[#2DD4BF]" />
                  {group.location || "Học Online"}
                </div>
              </div>
            </div>

            <div className="flex-shrink-0">
              {currentUserInfo.isMember ? (
                currentUserInfo.isLeader ? (
                  <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-4 py-2 rounded-xl text-sm font-bold shadow-sm inline-block">Trưởng nhóm</span>
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={handleLeaveGroup} 
                    disabled={isPending}
                    className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:border-rose-900/30 dark:text-rose-400 dark:hover:bg-rose-900/20 shadow-sm rounded-xl font-bold"
                  >
                    {isPending ? "Đang rời..." : "Rời nhóm"}
                  </Button>
                )
              ) : (
                <span className="bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 px-4 py-2 rounded-xl text-sm font-medium inline-block">Chưa tham gia</span>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-8 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 flex gap-6 overflow-x-auto hide-scrollbar">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center py-4 font-bold text-sm transition-all border-b-2 whitespace-nowrap ${isActive ? 'border-[#0D9488] text-[#0D9488] dark:border-[#2DD4BF] dark:text-[#2DD4BF]' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                <Icon className="h-4 w-4 mr-2" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-8 md:p-10 min-h-[400px] bg-white dark:bg-[#1a2332]">
          {activeTab === "sessions" && (
             <SessionsPanel groupId={group.id} isMember={currentUserInfo.isMember} sessions={sessions} />
          )}

          {activeTab === "announcements" && (
             <AnnouncementsPanel groupId={group.id} isMember={currentUserInfo.isMember} announcements={announcements} />
          )}

          {activeTab === "members" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {members.map((member: any) => (
                <div key={member.id} className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="h-10 w-10 rounded-full bg-[#0D9488]/10 text-[#0D9488] dark:bg-[#0D9488]/20 dark:text-[#2DD4BF] flex items-center justify-center font-bold font-display shadow-sm">
                    {member.profiles.full_name?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#1a2332] dark:text-slate-200 text-sm truncate">{member.profiles.full_name}</p>
                    {member.user_id === group.leader_id && (
                      <span className="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider">Trưởng nhóm</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

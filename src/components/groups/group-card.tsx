"use client";

import { joinGroup, leaveGroup } from "@/actions/group-actions";
import { Button } from "@/components/ui/button";
import { Users, MapPin, ExternalLink, LogOut } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import Link from "next/link";

interface GroupProps {
  id: string;
  name: string;
  description: string;
  location: string;
  memberCount: number;
  isMember: boolean;
  meetingLink?: string;
  leader_id?: string;
}

export function GroupCard({ group }: { group: GroupProps }) {
  const [isPending, startTransition] = useTransition();

  const handleJoin = () => {
    startTransition(async () => {
      const res = await joinGroup(group.id);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Tham gia nhóm thành công!");
      }
    });
  };

  const handleLeave = () => {
    startTransition(async () => {
      const res = await leaveGroup(group.id);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Đã rời nhóm.");
      }
    });
  };

  // Fake avatar stack array for aesthetic
  const stack = Array.from({ length: Math.min(group.memberCount || 1, 3) });

  return (
    <div className="bg-white dark:bg-[#1a2332] dark:border-slate-800 p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-full hover:border-[#0D9488]/30 hover:shadow-md transition font-body group">
      <div>
        <div className="flex justify-between items-start mb-4">
          <Link href={`/fptcolearn/groups/${group.id}`} className="hover:text-[#0D9488] dark:hover:text-[#2DD4BF] transition group-hover:text-[#0D9488] dark:group-hover:text-[#2DD4BF]">
            <h3 className="font-display font-bold text-xl text-[#1a2332] dark:text-slate-100 line-clamp-2">{group.name}</h3>
          </Link>
        </div>

        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-3 min-h-[60px] leading-relaxed">
          {group.description || "Chưa có mô tả."}
        </p>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            {/* Avatar Stack Overlay Anchor */}
            <div className="flex items-center">
              {stack.map((_, i) => (
                <div key={i} className={`h-8 w-8 rounded-full border-2 border-white dark:border-[#1a2332] flex items-center justify-center bg-gradient-to-br from-[#0D9488] to-[#2DD4BF] text-white text-xs font-bold ${i > 0 ? "-ml-3" : ""} shadow-sm relative z-${30 - i * 10}`}>
                   <Users className="h-3 w-3 opacity-70" />
                </div>
              ))}
              {group.memberCount > 3 && (
                <div className="h-8 w-8 rounded-full border-2 border-white dark:border-[#1a2332] flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold -ml-3 z-0 shadow-sm">
                  +{group.memberCount - 3}
                </div>
              )}
            </div>
            {stack.length === 0 && (
              <span className="text-xs text-slate-500 font-medium ml-2">Chưa có thành viên</span>
            )}
          </div>
        </div>

        <div className="space-y-3 mb-6 text-sm text-slate-600 dark:text-slate-300">
          <div className="flex items-center bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
            <MapPin className="h-4 w-4 mr-2.5 text-[#0D9488] dark:text-[#2DD4BF]" />
            <span className="font-medium">{group.location || "Online"}</span>
          </div>
          {group.isMember && group.meetingLink && (
            <a href={group.meetingLink} target="_blank" className="flex items-center bg-[#0D9488]/10 text-[#0D9488] dark:bg-[#0D9488]/20 dark:text-[#2DD4BF] hover:bg-[#0D9488]/20 p-2.5 rounded-lg font-medium transition">
              <ExternalLink className="h-4 w-4 mr-2.5" /> Link phòng họp
            </a>
          )}
        </div>
      </div>

      {group.isMember ? (
        <div className="flex gap-2">
          <Link href={`/fptcolearn/groups/${group.id}`} className="flex-1">
            <Button className="w-full bg-[#0D9488]/10 text-[#0D9488] hover:bg-[#0D9488]/20 dark:bg-[#0D9488]/20 dark:text-[#2DD4BF] dark:hover:bg-[#0D9488]/30 font-medium border-none shadow-none">
              Vào nhóm
            </Button>
          </Link>
          <Button 
            onClick={handleLeave} 
            disabled={isPending}
            variant="outline"
            className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 px-3"
            title="Rời nhóm"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          onClick={handleJoin}
          disabled={isPending}
          className="w-full font-medium bg-[#0D9488] hover:bg-[#0f766e] text-white shadow-md shadow-teal-500/20"
        >
          {isPending ? "Đang tham gia..." : "Tham gia nhóm"}
        </Button>
      )}
    </div>
  );
}

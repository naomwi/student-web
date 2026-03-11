"use client";

import { createDM } from "@/actions/chat-actions";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Linkedin, MessageSquare, Loader2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

interface Mentor {
  id: string;
  full_name: string;
  avatar_url: string;
  major?: string;
  year?: number;
  bio?: string;
  skills?: string[];
  linkedin_url?: string;
}

export function MentorCard({ mentor, currentUserId }: { mentor: Mentor; currentUserId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleContact = () => {
    if (!currentUserId) {
      toast.error("Vui lòng đăng nhập để liên hệ.");
      return;
    }

    startTransition(async () => {
      const result = await createDM(mentor.id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`Đã kết nối với ${mentor.full_name}!`, {
          description: "Hộp thoại chat đã được mở."
        });
        window.dispatchEvent(new CustomEvent("open-chat", { detail: { channelId: result.id } }));
      }
    });
  };

  return (
    <div className="bg-white dark:bg-[#1a2332] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-[#0D9488]/30 hover:shadow-xl transition-all group h-full flex flex-col font-body relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#0D9488]/5 to-transparent rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>

      <div className="flex items-start justify-between relative z-10">
        <div className="relative">
          <div className="h-20 w-20 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-slate-100 dark:border-slate-700 shadow-sm group-hover:border-[#0D9488]/30 transition-colors">
            <Avatar className="h-full w-full rounded-none">
              <AvatarImage src={mentor.avatar_url} className="object-cover" />
              <AvatarFallback className="text-2xl font-display font-bold text-[#0D9488] bg-slate-50 dark:bg-[#0D9488]/10 dark:text-[#2DD4BF] rounded-none">
                {mentor.full_name?.[0]}
              </AvatarFallback>
            </Avatar>
          </div>
          {/* Anchor: Online green pulse dot on avatar */}
          <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white dark:border-[#1a2332] shadow-sm animate-pulse z-20"></span>
        </div>
        
        {mentor.linkedin_url && (
          <a
            href={mentor.linkedin_url}
            target="_blank"
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:scale-110 transition p-2 bg-blue-50 dark:bg-blue-900/20 rounded-full"
            title="LinkedIn Profile"
          >
            <Linkedin className="h-5 w-5" />
          </a>
        )}
      </div>

      <div className="mt-5 flex-1 relative z-10">
        <h3 className="font-display font-bold text-xl text-[#1a2332] dark:text-slate-100 group-hover:text-[#0D9488] dark:group-hover:text-[#2DD4BF] transition-colors">
          {mentor.full_name}
        </h3>
        <p className="text-sm font-medium text-[#0D9488] dark:text-[#2DD4BF] mt-1 bg-[#0D9488]/10 dark:bg-[#0D9488]/20 inline-block px-2.5 py-0.5 rounded-full">
          {mentor.major} • Năm {mentor.year}
        </p>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-4 line-clamp-3 leading-relaxed">
          {mentor.bio || "Chưa có giới thiệu."}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 mb-6 relative z-10">
        {mentor.skills?.slice(0, 4).map((skill: string) => (
          <span
            key={skill}
            className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-medium text-xs px-2.5 py-1 rounded-md"
          >
            {skill}
          </span>
        ))}
        {mentor.skills && mentor.skills.length > 4 && (
          <span className="text-xs font-bold text-slate-400 py-1 bg-slate-50 dark:bg-slate-800/50 px-2 rounded-md border border-slate-100 dark:border-slate-800">
            +{mentor.skills.length - 4}
          </span>
        )}
      </div>

      <div className="pt-5 border-t border-slate-100 dark:border-slate-800 mt-auto relative z-10">
        <Button
          className={`w-full font-medium rounded-xl shadow-sm ${mentor.id === currentUserId ? 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400' : 'bg-[#0D9488] hover:bg-[#0f766e] text-white shadow-teal-500/20 hover:shadow-md transition-all group-hover:-translate-y-0.5'}`}
          onClick={handleContact}
          disabled={isPending || mentor.id === currentUserId}
        >
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <MessageSquare className="mr-2 h-4 w-4" />
          )}
          {mentor.id === currentUserId ? "Bạn (Me)" : "Nhắn tin hỏi bài"}
        </Button>
      </div>
    </div>
  );
}

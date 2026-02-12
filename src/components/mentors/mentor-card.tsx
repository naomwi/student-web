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
            description: "Hãy mở hộp chat (góc phải dưới) để bắt đầu nhắn tin."
        });
      }
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition group h-full flex flex-col">
      <div className="flex items-start justify-between">
        <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
          <Avatar className="h-full w-full">
            <AvatarImage src={mentor.avatar_url} className="object-cover" />
            <AvatarFallback className="text-xl font-bold text-indigo-600 bg-indigo-100">
                {mentor.full_name?.[0]}
            </AvatarFallback>
          </Avatar>
        </div>
        {mentor.linkedin_url && (
          <a
            href={mentor.linkedin_url}
            target="_blank"
            className="text-blue-600 hover:scale-110 transition"
          >
            <Linkedin className="h-5 w-5" />
          </a>
        )}
      </div>

      <div className="mt-4 flex-1">
        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
          {mentor.full_name}
        </h3>
        <p className="text-sm text-indigo-600 font-medium">
          {mentor.major} • Năm {mentor.year}
        </p>
        <p className="text-slate-500 text-sm mt-2 line-clamp-3">
          {mentor.bio || "Chưa có giới thiệu."}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 mb-6">
        {mentor.skills?.slice(0, 4).map((skill: string) => (
          <span
            key={skill}
            className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs px-2 py-1 rounded"
          >
            {skill}
          </span>
        ))}
        {mentor.skills && mentor.skills.length > 4 && (
             <span className="text-xs text-slate-400 py-1">+ {mentor.skills.length - 4}</span>
        )}
      </div>

      <div className="pt-4 border-t border-slate-50 dark:border-slate-800 mt-auto">
        <Button 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
            onClick={handleContact}
            disabled={isPending || mentor.id === currentUserId}
        >
          {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
              <MessageSquare className="mr-2 h-4 w-4" />
          )}
          {mentor.id === currentUserId ? "Bạn (Me)" : "Liên hệ"}
        </Button>
      </div>
    </div>
  );
}

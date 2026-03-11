"use client";

import { useState, useTransition } from "react";
import { postAnnouncement } from "@/actions/group-actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Megaphone, Send, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Announcement {
  id: string;
  content: string;
  created_at: string;
  profiles: { full_name: string; avatar_url?: string };
}

export function AnnouncementsPanel({ groupId, isMember, announcements }: { groupId: string, isMember: boolean, announcements: Announcement[] }) {
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();

  const handlePost = () => {
    if (!content.trim()) return;
    
    startTransition(async () => {
      const res = await postAnnouncement(groupId, content);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Đăng thông báo thành công!");
        setContent("");
      }
    });
  };

  return (
    <div className="space-y-6">
      {isMember && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Viết thông báo cho nhóm..."
            className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl p-3 text-sm focus:ring-1 focus:ring-[#0D9488] resize-none min-h-[80px]"
          />
          <div className="flex justify-end mt-2">
            <Button 
              onClick={handlePost} 
              disabled={isPending || !content.trim()} 
              className="bg-[#0D9488] hover:bg-[#0f766e] text-white rounded-xl shadow-sm"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
              Đăng thông báo
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {announcements.map((ann) => (
          <div key={ann.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-10 w-10 border border-slate-100 shadow-sm">
                <AvatarImage src={ann.profiles?.avatar_url} />
                <AvatarFallback className="bg-[#0D9488]/10 text-[#0D9488] font-bold">{ann.profiles?.full_name?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold text-[#1a2332] dark:text-slate-200 text-sm">{ann.profiles?.full_name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(ann.created_at).toLocaleString("vi-VN")}</p>
              </div>
            </div>
            <p className="text-slate-700 dark:text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">{ann.content}</p>
          </div>
        ))}

        {announcements.length === 0 && (
          <div className="text-center py-12 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
            <Megaphone className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">Chưa có thông báo nào.</p>
          </div>
        )}
      </div>
    </div>
  );
}

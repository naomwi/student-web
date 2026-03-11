"use client";

import { useState, useTransition } from "react";
import { addGroupSession } from "@/actions/group-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { CalendarPlus, Loader2, Calendar, MapPin, Plus } from "lucide-react";

interface Session {
  id: string;
  topic: string;
  start_time: string;
  location: string;
  profiles: { full_name: string };
}

export function SessionsPanel({ groupId, isMember, sessions }: { groupId: string, isMember: boolean, sessions: Session[] }) {
  const [showForm, setShowForm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleAdd = (formData: FormData) => {
    startTransition(async () => {
      const res = await addGroupSession(groupId, formData);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Thêm lịch học thành công!");
        setShowForm(false);
      }
    });
  };

  const now = new Date();
  const upcoming = sessions.filter(s => new Date(s.start_time) >= now);
  const past = sessions.filter(s => new Date(s.start_time) < now);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-display font-bold text-xl text-[#1a2332] dark:text-slate-200">Lịch học & Sự kiện</h3>
        {isMember && !showForm && (
          <Button onClick={() => setShowForm(true)} className="bg-[#0D9488] hover:bg-[#0f766e] text-white shadow-sm rounded-xl h-9">
            <Plus className="h-4 w-4 mr-1" /> Thêm lịch
          </Button>
        )}
      </div>

      {showForm && (
        <form action={handleAdd} className="bg-white dark:bg-slate-900 border border-[#0D9488]/30 dark:border-[#0D9488]/50 rounded-2xl p-5 shadow-lg shadow-teal-500/5 animate-in fade-in slide-in-from-top-4 space-y-4">
          <h4 className="font-bold text-[#1a2332] dark:text-white">Lên lịch mới</h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-500">Chủ đề buổi học</label>
              <Input name="topic" required placeholder="Vd: Ôn tập Giữa kỳ Giải tích" className="rounded-xl border-slate-200 focus-visible:ring-[#0D9488]" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">Thời gian bắt đầu</label>
              <Input name="start_time" type="datetime-local" required className="rounded-xl border-slate-200 focus-visible:ring-[#0D9488]" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500">Địa điểm / Link phòng</label>
              <Input name="location" placeholder="Vd: Thư viện hoặc Meet link" className="rounded-xl border-slate-200 focus-visible:ring-[#0D9488]" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)} className="rounded-xl">Hủy</Button>
            <Button type="submit" disabled={isPending} className="bg-[#0D9488] hover:bg-[#0f766e] text-white rounded-xl">
              {isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />} Lưu lịch học
            </Button>
          </div>
        </form>
      )}

      {upcoming.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Sắp diễn ra</h4>
          {upcoming.map(s => <SessionCard key={s.id} session={s} />)}
        </div>
      )}

      {past.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Đã qua</h4>
          <div className="opacity-70">
            {past.map(s => <SessionCard key={s.id} session={s} />)}
          </div>
        </div>
      )}

      {sessions.length === 0 && !showForm && (
        <div className="text-center py-12 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
          <CalendarPlus className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">Chưa có lịch học nào.</p>
        </div>
      )}
    </div>
  );
}

function SessionCard({ session }: { session: Session }) {
  return (
    <div className="flex items-start gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:border-[#0D9488]/30 transition group">
      <div className="bg-[#0D9488]/10 text-[#0D9488] dark:bg-[#2DD4BF]/10 dark:text-[#2DD4BF] p-3 rounded-xl flex flex-col items-center justify-center min-w-[60px] group-hover:bg-[#0D9488] group-hover:text-white transition-colors">
        <span className="text-xs font-bold uppercase">{new Date(session.start_time).toLocaleDateString("vi-VN", { month: "short" })}</span>
        <span className="text-xl font-display font-bold leading-none mt-1">{new Date(session.start_time).getDate()}</span>
      </div>
      <div className="flex-1">
        <h5 className="font-bold text-[#1a2332] dark:text-slate-200 text-base mb-1">{session.topic}</h5>
        <div className="space-y-1">
          <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 font-medium">
            <Calendar className="h-3 w-3 mr-1.5" />
            {new Date(session.start_time).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
          </div>
          {session.location && (
            <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 font-medium">
              <MapPin className="h-3 w-3 mr-1.5" />
              {session.location}
            </div>
          )}
        </div>
        <p className="text-[10px] text-slate-400 mt-2">Tạo bởi {session.profiles?.full_name}</p>
      </div>
    </div>
  );
}

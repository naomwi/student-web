"use client";

import { useState } from "react";
import { submitReport } from "@/actions/report-actions";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export function ReportButton({ targetId, targetType }: { targetId: string, targetType: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    formData.append("targetId", targetId);
    formData.append("targetType", targetType);
    
    const res = await submitReport(null, formData);
    setIsPending(false);
    
    if (res?.success) {
      alert(res.success);
      setIsOpen(false);
    } else {
      alert(res?.error);
    }
  };

  if (!isOpen) {
    return (
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)} className="text-gray-400 hover:text-red-600">
        <AlertTriangle className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-900 dark:border dark:border-slate-800 p-6 rounded-lg w-full max-w-md shadow-lg">
        <h3 className="font-bold text-lg mb-4 text-red-600 dark:text-red-500">Báo cáo nội dung vi phạm</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea 
            name="reason" 
            className="w-full border dark:border-slate-700 p-2 rounded dark:bg-slate-800 dark:text-white" 
            placeholder="Tại sao bạn báo cáo nội dung này?"
            required
            rows={4}
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="dark:text-slate-300 dark:hover:bg-slate-800">Hủy</Button>
            <Button type="submit" variant="destructive" disabled={isPending}>
              {isPending ? "Đang gửi..." : "Gửi báo cáo"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

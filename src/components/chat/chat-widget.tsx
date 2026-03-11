"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X } from "lucide-react";
import { ChatWindow } from "./chat-window";

export function ChatWidget({ userId }: { userId: string }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener("open-chat", handleOpenChat);
    return () => window.removeEventListener("open-chat", handleOpenChat);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[380px] h-[500px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-300 font-body">
          <ChatWindow userId={userId} onClose={() => setIsOpen(false)} />
        </div>
      )}

      <Button
        size="icon"
        className={`h-14 w-14 rounded-full shadow-xl shadow-teal-500/30 transition-transform duration-300 ${isOpen ? "rotate-90 bg-slate-200 text-slate-600 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 shadow-none" : "bg-[#0D9488] hover:bg-[#0f766e] text-white hover:scale-110"
          }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-7 w-7" />}
      </Button>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import { getMessages, sendMessage } from "@/actions/chat-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  profiles: {
    full_name: string;
    avatar_url: string;
  };
}

export function MessageList({ channel, userId }: { channel: { id: string }, userId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // Fetch initial messages
  useEffect(() => {
    async function fetch() {
      setLoading(true);
      const data = await getMessages(channel.id);
      setMessages(data as any);
      setLoading(false);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
    fetch();

    // Subscribe to Realtime
    const channelSub = supabase
      .channel(`chat:${channel.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `channel_id=eq.${channel.id}` },
        async (payload) => {
          // Fetch the full message details (including profile)
          const { data } = await supabase
            .from('messages')
            .select("*, profiles(full_name, avatar_url)")
            .eq('id', payload.new.id)
            .single();

          if (data) {
            setMessages(prev => [...prev, data as any]);
            setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channelSub);
    };
  }, [channel.id]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const text = inputText;
    setInputText(""); // Clear input

    // Optimistic UI update
    const tempMsg: Message = {
      id: "temp-" + Date.now(),
      content: text,
      user_id: userId,
      created_at: new Date().toISOString(),
      profiles: { full_name: "Bạn", avatar_url: "" }
    };
    setMessages(prev => [...prev, tempMsg]);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);

    startTransition(async () => {
      await sendMessage(channel.id, text);
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50">
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin text-indigo-500" /></div>
        ) : messages.length === 0 ? (
          <p className="text-center text-slate-400 text-sm mt-10">Chưa có tin nhắn nào. Hãy bắt đầu trò chuyện!</p>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.user_id === userId;
            const showAvatar = idx === 0 || messages[idx - 1].user_id !== msg.user_id;

            return (
              <div key={msg.id} className={`flex gap-3 ${isMe ? "flex-row-reverse" : "flex-row"} ${msg.id.startsWith("temp-") ? "opacity-70" : ""}`}>
                {/* Avatar */}
                <div className="w-8 flex-shrink-0">
                  {showAvatar && !isMe && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={msg.profiles?.avatar_url} />
                      <AvatarFallback>{msg.profiles?.full_name?.[0]}</AvatarFallback>
                    </Avatar>
                  )}
                </div>

                {/* Bubble */}
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${isMe
                    ? "bg-indigo-600 text-white rounded-br-none"
                    : "bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none shadow-sm"
                  }`}>
                  {!isMe && showAvatar && <p className="text-[10px] text-slate-400 mb-1 font-bold">{msg.profiles?.full_name}</p>}
                  <p>{msg.content}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* INPUT AREA */}
      <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-2">
        <Input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Nhập tin nhắn..."
          className="rounded-full bg-slate-100 dark:bg-slate-800 border-transparent focus:bg-white dark:focus:bg-slate-900 transition-all"
        />
        <Button
          size="icon"
          className="rounded-full bg-indigo-600 hover:bg-indigo-700"
          onClick={handleSend}
          disabled={!inputText.trim() || sending}
        >
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}

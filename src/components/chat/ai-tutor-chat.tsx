"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Loader2, Sparkles } from "lucide-react";

export function AITutorChat() {
    const [messages, setMessages] = useState<{ id: string; role: "user" | "assistant"; content: string }[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = { id: Date.now().toString(), role: "user" as const, content: input.trim() };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: newMessages }),
            });

            if (!response.ok) throw new Error("Lấy phản hồi thất bại");
            if (!response.body) throw new Error("Không có luồng dữ liệu");

            const assistantId = (Date.now() + 1).toString();
            setMessages(prev => [...prev, { id: assistantId, role: "assistant", content: "" }]);

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let assistantContent = "";

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                assistantContent += chunk;

                setMessages(prev =>
                    prev.map(msg => msg.id === assistantId ? { ...msg, content: assistantContent } : msg)
                );
            }
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { id: Date.now().toString(), role: "assistant", content: "Xin lỗi, đã xảy ra lỗi khi kết nối với Gia sư AI. Vui lòng thử lại!" }]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900/50">
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-6 max-w-3xl mx-auto pb-6" ref={scrollRef}>

                    {messages.length === 0 && (
                        <div className="text-center py-10 opacity-70">
                            <div className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 h-16 w-16 rounded-2xl mx-auto flex items-center justify-center mb-4">
                                <Sparkles className="h-8 w-8" />
                            </div>
                            <h3 className="font-bold text-xl text-slate-800 dark:text-slate-200 mb-2">Xin chào! Mình là Gia sư AI.</h3>
                            <p className="text-sm text-slate-500 max-w-md mx-auto">
                                Hỏi mình bất cứ câu hỏi nào về bài tập, khái niệm môn học hoặc định hướng học tập. Mình sử dụng Gemini 3.0 Flash Preview để trả lời siêu nhanh và chính xác!
                            </p>
                        </div>
                    )}

                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"
                                }`}
                        >
                            {message.role === "assistant" && (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                                    <Bot className="h-4 w-4 text-white" />
                                </div>
                            )}

                            <div
                                className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${message.role === "user"
                                    ? "bg-indigo-600 text-white rounded-tr-sm"
                                    : "bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-sm prose prose-sm dark:prose-invert"
                                    }`}
                                style={{ whiteSpace: "pre-wrap" }}
                                dangerouslySetInnerHTML={{ __html: message.content.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br/>') }}
                            />

                            {message.role === "user" && (
                                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                                    <User className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                                </div>
                            )}
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex gap-3 justify-start">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                                <Bot className="h-4 w-4 text-white" />
                            </div>
                            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex flex-col gap-1 items-start">
                                <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
                                <span className="text-xs text-slate-400">Đang suy nghĩ...</span>
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>

            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                <form
                    onSubmit={handleSubmit}
                    className="max-w-3xl mx-auto flex items-center gap-2"
                >
                    <Input
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Hỏi gia sư AI về bài tập của bạn..."
                        className="flex-1 rounded-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 px-4 focus-visible:ring-indigo-500"
                        disabled={isLoading}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 shadow-md transition-all disabled:opacity-50"
                        disabled={isLoading || !input.trim()}
                    >
                        <Send className="h-4 w-4 text-white" />
                    </Button>
                </form>
                <div className="text-center mt-2">
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold flex items-center justify-center gap-1">
                        <Sparkles className="h-3 w-3" /> Powered by Gemini 3.0 Flash Preview
                    </span>
                </div>
            </div>
        </div>
    );
}

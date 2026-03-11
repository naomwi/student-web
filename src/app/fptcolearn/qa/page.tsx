"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Tag, CheckCircle2, MessageCircleQuestion, ThumbsUp, Plus, Search } from "lucide-react";
import { CreateQuestionDialog } from "@/components/qa/create-question-dialog";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/empty-state";
import { FAB } from "@/components/shared/fab";
import { PageBadge } from "@/components/shared/page-badge";

export default function QAPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const supabase = createClient();
  const [upvotes, setUpvotes] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("questions")
        .select("*, profiles(full_name, avatar_url), answers(count)")
        .order("created_at", { ascending: false });
      if (data) setQuestions(data);
    }
    load();
  }, [supabase]);

  const toggleUpvote = (id: string) => {
    setUpvotes(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="space-y-8 pb-24 font-body">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight text-[#1a2332] dark:text-white">Hỏi đáp cộng đồng</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Nơi giải đáp mọi thắc mắc học tập</p>
        </div>
        
        <div className="w-full md:w-auto flex items-center gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Tìm kiếm câu hỏi..." 
              className="pl-9 rounded-full bg-white dark:bg-[#1a2332] border-slate-200 dark:border-slate-800 focus-visible:ring-[#0D9488]"
            />
          </div>
          <div className="hidden md:block">
            <CreateQuestionDialog />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {questions?.map((q) => (
          <div key={q.id} className="bg-white dark:bg-[#1a2332] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-[#0D9488]/30 hover:shadow-md transition">
            <div className="flex gap-4">
              {/* Vote/Status Column */}
              <div className="flex flex-col items-center gap-2 min-w-[60px]">
                <button 
                  onClick={() => toggleUpvote(q.id)}
                  className={`flex flex-col items-center gap-1 transition group ${upvotes[q.id] ? 'text-[#0D9488]' : 'text-slate-400 hover:text-[#0D9488]'}`}
                >
                  <div className={`p-2 rounded-full transition-colors ${upvotes[q.id] ? 'bg-[#0D9488]/10' : 'group-hover:bg-[#0D9488]/10'}`}>
                     <ThumbsUp className={`h-5 w-5 ${upvotes[q.id] ? 'fill-[#0D9488]' : ''}`} />
                  </div>
                  <span className={`font-bold ${upvotes[q.id] ? 'text-[#0D9488]' : 'text-slate-700 dark:text-slate-300'}`}>
                    {upvotes[q.id] ? 1 : 0}
                  </span>
                </button>

                <div className="mt-2 w-full flex justify-center">
                  {q.is_solved ? (
                    <PageBadge variant="answered" className="w-full flex-col py-2">
                      <span className="font-bold text-sm leading-none">{q.answers[0]?.count || 0}</span>
                      <span className="text-[9px] mt-1">trả lời</span>
                      <CheckCircle2 className="h-3.5 w-3.5 mt-1" />
                    </PageBadge>
                  ) : (
                    <div className="flex flex-col items-center p-2 rounded-lg w-full bg-slate-50 dark:bg-slate-800/50 text-slate-500 border border-transparent">
                      <span className="font-bold">{q.answers[0]?.count || 0}</span>
                      <span className="text-[10px] uppercase font-bold tracking-wider">trả lời</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Content Column */}
              <div className="flex-1">
                <Link href={`/fptcolearn/qa/${q.id}`} className="block group">
                  <h3 className="text-xl font-display font-bold text-[#1a2332] dark:text-slate-100 group-hover:text-[#0D9488] dark:group-hover:text-[#2DD4BF] transition-colors mb-2">{q.title}</h3>
                </Link>
                <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-4">{q.content}</p>

                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    {q.tags?.map((tag: string) => (
                      <span key={tag} className="bg-[#0D9488]/10 text-[#0D9488] dark:bg-[#2DD4BF]/10 dark:text-[#2DD4BF] text-xs font-medium px-2.5 py-1 rounded-md flex items-center">
                        <Tag className="h-3 w-3 mr-1" /> {tag}
                      </span>
                    ))}
                  </div>

                  <div className="text-xs text-slate-500 flex items-center gap-1">
                    <span>bởi <span className="font-semibold text-slate-700 dark:text-slate-300">{(q.profiles as any)?.full_name}</span></span>
                    <span>• {new Date(q.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {questions?.length === 0 && (
          <EmptyState 
            icon={<MessageCircleQuestion className="h-12 w-12 text-slate-300" />} 
            message="Chưa có câu hỏi nào. Hãy là người đầu tiên đặt câu hỏi!" 
          />
        )}
      </div>

      <div className="md:hidden">
        <CreateQuestionDialog 
           trigger={
             <FAB icon={<Plus className="h-6 w-6" />} label="Hỏi câu mới" />
           }
        />
      </div>
    </div>
  );
}

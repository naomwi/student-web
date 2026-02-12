import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MessageCircleQuestion, Tag, CheckCircle2 } from "lucide-react";
import { CreateQuestionDialog } from "@/components/qa/create-question-dialog";

export default async function QAPage() {
  const supabase = await createClient();

  // Fetch questions
  const { data: questions } = await supabase
    .from("questions")
    .select("*, profiles(full_name, avatar_url), answers(count)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold tracking-tight">Hỏi đáp cộng đồng</h2>
           <p className="text-gray-500 text-sm">Nơi giải đáp mọi thắc mắc học tập</p>
        </div>
        <CreateQuestionDialog />
      </div>

      <div className="space-y-4">
        {questions?.map((q) => (
          <div key={q.id} className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition">
            <div className="flex gap-4">
              {/* Vote/Status Column */}
              <div className="flex flex-col items-center gap-2 min-w-[60px] text-gray-500">
                <span className="text-xl font-bold text-gray-700">0</span>
                <span className="text-xs">votes</span>
                
                <div className={`mt-2 flex flex-col items-center p-2 rounded ${q.is_solved ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
                   <span className="font-bold">{q.answers[0]?.count || 0}</span>
                   <span className="text-xs">trả lời</span>
                   {q.is_solved && <CheckCircle2 className="h-4 w-4 mt-1" />}
                </div>
              </div>

              {/* Content Column */}
              <div className="flex-1">
                <Link href={`/dashboard/qa/${q.id}`} className="block">
                  <h3 className="text-lg font-bold text-blue-600 hover:underline mb-2">{q.title}</h3>
                </Link>
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">{q.content}</p>
                
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    {q.tags?.map((tag: string) => (
                      <span key={tag} className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded flex items-center">
                        <Tag className="h-3 w-3 mr-1" /> {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <span>đăng bởi <span className="font-semibold text-blue-700">{(q.profiles as any)?.full_name}</span></span>
                    <span>• {new Date(q.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {questions?.length === 0 && (
          <div className="text-center py-10 text-gray-500 bg-white rounded-lg border">
            Chưa có câu hỏi nào. Hãy là người đầu tiên đặt câu hỏi!
          </div>
        )}
      </div>
    </div>
  );
}

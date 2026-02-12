import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2, User } from "lucide-react";
import { AnswerForm } from "@/components/qa/answer-form";
import { AcceptAnswerButton } from "@/components/qa/accept-answer-button";
import Image from "next/image";

type Props = {
  params: Promise<{ id: string }>
}

export default async function QuestionDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch question
  const { data: question } = await supabase
    .from("questions")
    .select("*, profiles(full_name, avatar_url)")
    .eq("id", id)
    .single();

  if (!question) notFound();

  // Fetch answers
  const { data: answers } = await supabase
    .from("answers")
    .select("*, profiles(full_name, avatar_url)")
    .eq("question_id", id)
    .order("is_accepted", { ascending: false }) // Accepted lên đầu
    .order("created_at", { ascending: true });

  const isAuthor = user?.id === question.author_id;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* QUESTION */}
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h1 className="text-2xl font-bold mb-4 text-blue-800">{question.title}</h1>
        <div className="prose max-w-none text-gray-800 mb-6 whitespace-pre-wrap">
          {question.content}
        </div>

        {/* Question Images */}
        {question.images && question.images.length > 0 && (
          <div className="flex flex-wrap gap-4 mb-6">
            {question.images.map((url: string, idx: number) => (
              <div key={idx} className="relative h-48 w-full md:w-1/3 rounded-lg overflow-hidden border border-slate-200">
                <Image src={url} alt={`Ảnh minh họa ${idx + 1}`} fill className="object-contain bg-slate-50" />
              </div>
            ))}
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 mb-4">
          {question.tags?.map((tag: string) => (
            <span key={tag} className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded">
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex justify-end items-center gap-2 text-sm text-gray-500 bg-gray-50 p-3 rounded">
           <span>Đăng bởi </span>
           <span className="font-semibold text-blue-700">{(question.profiles as any)?.full_name}</span>
           <span> • {new Date(question.created_at).toLocaleString()}</span>
        </div>
      </div>

      <h2 className="text-xl font-bold">{answers?.length || 0} Câu trả lời</h2>

      {/* ANSWER LIST */}
      <div className="space-y-6">
        {answers?.map((ans) => (
          <div key={ans.id} className={`p-6 rounded-lg border shadow-sm ${ans.is_accepted ? 'bg-green-50 border-green-200 ring-1 ring-green-300' : 'bg-white'}`}>
            <div className="flex gap-4">
               {/* Status Icon */}
               <div className="w-8 pt-1 flex flex-col items-center">
                 {ans.is_accepted && <CheckCircle2 className="h-8 w-8 text-green-600" />}
                 
                 {isAuthor && !question.is_solved && (
                    <AcceptAnswerButton answerId={ans.id} questionId={question.id} />
                 )}
               </div>

               <div className="flex-1">
                 <div className="mb-4 text-gray-800 whitespace-pre-wrap">{ans.content}</div>
                 
                 <div className="flex justify-between items-center text-sm">
                    {ans.is_accepted ? (
                        <span className="text-green-700 font-bold flex items-center">
                            <CheckCircle2 className="h-4 w-4 mr-1" /> Đã chấp nhận
                        </span>
                    ) : <span></span>}

                    <div className="flex items-center gap-2 text-gray-500">
                        <User className="h-4 w-4" />
                        <span className="font-semibold">{(ans.profiles as any)?.full_name}</span>
                        <span>• {new Date(ans.created_at).toLocaleTimeString()}</span>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* ANSWER FORM */}
      <div className="bg-white p-6 rounded-lg border shadow-sm">
        <h3 className="font-bold mb-4">Câu trả lời của bạn</h3>
        <AnswerForm questionId={question.id} />
      </div>
    </div>
  );
}

"use client";

import { useTransition } from "react";
import { acceptAnswer } from "@/actions/qa-actions";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AcceptAnswerButton({ answerId, questionId }: { answerId: string, questionId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleAccept = () => {
    if (!confirm("Xác nhận đây là câu trả lời đúng nhất?")) return;
    
    startTransition(async () => {
      await acceptAnswer(answerId, questionId);
    });
  };

  return (
    <button 
      onClick={handleAccept} 
      disabled={isPending}
      className="mt-2 text-gray-300 hover:text-green-500 transition tooltip"
      title="Chấp nhận câu trả lời này"
    >
      <Check className="h-8 w-8" />
    </button>
  );
}

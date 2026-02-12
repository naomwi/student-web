"use client";

import { useTransition, useRef } from "react";
import { submitAnswer } from "@/actions/qa-actions";
import { Button } from "@/components/ui/button";

export function AnswerForm({ questionId }: { questionId: string }) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const res = await submitAnswer(null, formData);
      if (res?.success) {
        formRef.current?.reset();
      } else {
        alert(res?.error);
      }
    });
  };

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4">
      <input type="hidden" name="questionId" value={questionId} />
      <textarea 
        name="content"
        className="w-full min-h-[150px] p-3 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        placeholder="Nhập câu trả lời chi tiết..."
        required
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Đang gửi..." : "Gửi câu trả lời"}
        </Button>
      </div>
    </form>
  );
}

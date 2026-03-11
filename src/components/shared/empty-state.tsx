import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Props {
  icon: React.ReactNode;
  message: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({ icon, message, actionLabel, actionHref }: Props) {
  return (
    <div className="text-center py-12 bg-slate-50/50 dark:bg-[#111827] rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center">
      <div className="text-slate-300 mb-4 h-12 w-12 flex justify-center items-center">
        {icon}
      </div>
      <p className="text-slate-500 dark:text-slate-400 font-body mb-6">{message}</p>
      {actionHref && actionLabel && (
        <Link href={actionHref}>
          <Button className="bg-[#0D9488] hover:bg-[#0f766e] text-white rounded-xl shadow-lg shadow-teal-500/20 dark:shadow-none font-body">
            {actionLabel}
          </Button>
        </Link>
      )}
    </div>
  );
}

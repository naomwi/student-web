import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

interface Props {
  icon: React.ReactNode;
  title: string;
  href?: string;
  label?: string; // "Xem tất cả"
}

export function SectionHeader({ icon, title, href, label }: Props) {
  return (
    <div className="flex justify-between items-center bg-gradient-to-r from-slate-50/50 dark:from-white/5 dark:to-transparent pb-4 border-b border-slate-50 dark:border-white/5 mb-6 p-6 md:p-8">
      <h3 className="font-display font-bold text-xl text-[#1a2332] dark:text-slate-200 flex items-center">
        <div className="p-2.5 bg-[#0D9488]/10 dark:bg-[#0D9488]/20 rounded-xl mr-4 border border-[#0D9488]/20 dark:border-[#0D9488]/30 text-[#0D9488] dark:text-[#2DD4BF]">
          {icon}
        </div>
        {title}
      </h3>
      {href && label && (
        <Link href={href}>
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-[#0D9488] dark:hover:text-[#2DD4BF] gap-1 font-body">
            {label} <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
          </Button>
        </Link>
      )}
    </div>
  );
}

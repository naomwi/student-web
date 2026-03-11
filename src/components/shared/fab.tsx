import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Props {
  icon: React.ReactNode;
  href?: string;
  label?: string;
  onClick?: () => void;
  className?: string;
}

export function FAB({ icon, href, label, onClick, className = "fixed bottom-24 right-8 z-40 md:bottom-8" }: Props) {
  const btn = (
    <Button 
      onClick={onClick}
      className="h-14 w-14 rounded-full shadow-xl shadow-teal-500/30 bg-[#0D9488] hover:bg-[#0f766e] text-white hover:scale-105 transition-transform p-0 flex items-center justify-center"
      aria-label={label}
      title={label}
    >
      {icon}
    </Button>
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {btn}
      </Link>
    );
  }

  return (
    <div className={className}>
      {btn}
    </div>
  );
}

import React from "react";

type Variant = "answered" | "new" | "admin" | "pending";

interface Props {
  variant: Variant;
  children: React.ReactNode;
  className?: string;
}

export function PageBadge({ variant, children, className = "" }: Props) {
  const styles = {
    answered: "bg-[#0D9488]/10 text-[#0D9488] border border-[#0D9488]/20",
    new: "bg-indigo-100 text-indigo-700 border border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400",
    admin: "bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-900/30 dark:text-rose-400",
    pending: "bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-900/30 dark:text-amber-400",
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
}

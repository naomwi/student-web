"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type Gradient = "teal" | "orange" | "violet";

interface Props {
  title: string;
  value: number;
  icon: React.ReactNode;
  desc: string;
  gradient: Gradient;
}

export function StatCard({ title, value, icon, desc, gradient }: Props) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) {
      setCount(end);
      return;
    }
    const totalDuration = 1500;
    const incrementTime = 30;
    const steps = totalDuration / incrementTime;
    const increment = end / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value]);

  const gradientStyles = {
    teal: "from-teal-500 to-cyan-600 dark:from-teal-900 dark:to-cyan-950",
    orange: "from-orange-400 to-rose-500 dark:from-orange-900 dark:to-rose-950",
    violet: "from-indigo-500 to-violet-600 dark:from-indigo-900 dark:to-violet-950",
  };

  return (
    <Card className={`border-none shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden bg-gradient-to-br ${gradientStyles[gradient]}`}>
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
      <div className="absolute -left-6 -bottom-6 w-20 h-20 bg-black/5 rounded-full blur-xl"></div>

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 z-10 relative">
        <CardTitle className="text-sm font-medium text-white/80 font-body">{title}</CardTitle>
        <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm border border-white/10 shadow-inner">
          {icon}
        </div>
      </CardHeader>
      <CardContent className="z-10 relative font-display">
        <div className="text-4xl font-bold text-white mt-2 mb-1">
          {count}
        </div>
        <p className="text-xs font-medium text-white/60 font-body">{desc}</p>
      </CardContent>
    </Card>
  );
}

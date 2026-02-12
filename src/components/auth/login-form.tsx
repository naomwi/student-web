"use client";

import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas/auth";
import { loginAction } from "@/actions/auth-actions";
import { SocialButtons } from "./social-button";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { identifier: "", password: "" },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    startTransition(async () => {
      const result = await loginAction(values);
      if (result?.error) {
        setError(result.error);
      }
    });
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6 p-8 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-100 dark:border-slate-800">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Chào mừng trở lại!</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">Đăng nhập để tiếp tục học tập</p>
      </div>

      <SocialButtons />

      <div className="relative">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200 dark:border-slate-800" /></div>
        <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-slate-900 px-2 text-gray-500 dark:text-slate-400">Hoặc tiếp tục với</span></div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium dark:text-slate-300">Email hoặc Username</label>
          <Input 
            {...form.register("identifier")} 
            placeholder="sinhvien@example.com hoặc username" 
            disabled={isPending}
            className="dark:bg-slate-800 dark:border-slate-700"
          />
          {form.formState.errors.identifier && (
            <p className="text-red-500 text-xs">{form.formState.errors.identifier.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium dark:text-slate-300">Mật khẩu</label>
          <Input 
            {...form.register("password")} 
            type="password" 
            disabled={isPending}
            placeholder="••••••••" 
            className="dark:bg-slate-800 dark:border-slate-700"
          />
           {form.formState.errors.password && (
            <p className="text-red-500 text-xs">{form.formState.errors.password.message}</p>
          )}
        </div>

        {error && <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-md">{error}</div>}

        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" disabled={isPending}>
          {isPending ? "Đang xử lý..." : "Đăng nhập"}
        </Button>
      </form>
      
      <div className="text-center text-sm dark:text-slate-400">
        Chưa có tài khoản? <a href="/register" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Đăng ký ngay</a>
      </div>
    </div>
  );
}

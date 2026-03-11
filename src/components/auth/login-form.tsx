"use client";

import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas/auth";
import { loginAction } from "@/actions/auth-actions";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="w-full space-y-6 p-8 bg-white dark:bg-[#1a2332] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800">
      <div className="text-center">
        <h1 className="text-2xl font-bold font-plus-jakarta text-[#1a2332] dark:text-slate-100">Chào mừng trở lại!</h1>
        <p className="text-sm font-lato text-slate-500 dark:text-slate-400 mt-2">Đăng nhập để tiếp tục học tập</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 font-lato">
        <div className="space-y-2">
          <label htmlFor="identifier" className="text-sm font-medium text-[#134E4A] dark:text-slate-300">Email hoặc Username</label>
          <Input
            id="identifier"
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
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-[#134E4A] dark:text-slate-300">Mật khẩu</label>
            <Link href="/forgot-password" className="text-sm font-medium text-[#0D9488] hover:text-[#0f766e] dark:text-[#2DD4BF] dark:hover:text-teal-300 hover:underline cursor-pointer">
              Quên mật khẩu?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              {...form.register("password")}
              type={showPassword ? "text" : "password"}
              disabled={isPending}
              placeholder="••••••••"
              className="pr-10 dark:bg-slate-800 dark:border-slate-700"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 cursor-pointer"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {form.formState.errors.password && (
            <p className="text-red-500 text-xs">{form.formState.errors.password.message}</p>
          )}
        </div>

        {error && <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-md">{error}</div>}

        <Button 
          type="submit" 
          className="w-full bg-[#0D9488] hover:bg-[#0f766e] text-white transition-colors duration-200 cursor-pointer font-medium" 
          disabled={isPending}
        >
          {isPending ? "Đang xử lý..." : "Đăng nhập"}
        </Button>
      </form>

      <div className="text-center text-sm font-lato text-slate-600 dark:text-slate-400">
        Chưa có tài khoản? <Link href="/register" className="font-semibold text-[#0D9488] dark:text-[#2DD4BF] hover:underline cursor-pointer">Đăng ký ngay</Link>
      </div>
    </div>
  );
}

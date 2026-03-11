"use client";

import { useTransition, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/schemas/auth";
import { signupAction } from "@/actions/auth-actions";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function RegisterForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { email: "", username: "", password: "", confirmPassword: "", full_name: "" },
  });

  const watchPassword = form.watch("password", "");

  useEffect(() => {
    let strength = 0;
    if (watchPassword.length >= 8) strength += 25;
    if (watchPassword.match(/[a-z]/)) strength += 25;
    if (watchPassword.match(/[A-Z]/)) strength += 25;
    if (watchPassword.match(/[0-9!@#$%^&*]/)) strength += 25;
    setPasswordStrength(strength);
  }, [watchPassword]);

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");
    startTransition(async () => {
      const result = await signupAction(values);
      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        setSuccess(result.success);
      }
    });
  };

  const strengthColor = passwordStrength < 50 ? 'bg-rose-500' : passwordStrength < 100 ? 'bg-amber-400' : 'bg-emerald-500';

  return (
    <div className="w-full space-y-6 p-8 bg-white dark:bg-[#1a2332] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800">
      <div className="text-center">
        <h1 className="text-2xl font-bold font-display text-[#1a2332] dark:text-slate-100">Tạo tài khoản mới</h1>
        <p className="text-sm font-body text-slate-500 dark:text-slate-400 mt-2">Tham gia cộng đồng sinh viên ngay hôm nay</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 font-body">
        <div className="space-y-2">
          <label htmlFor="full_name" className="text-sm font-medium text-[#134E4A] dark:text-slate-300">Họ và tên</label>
          <Input
            id="full_name"
            {...form.register("full_name")}
            placeholder="Nguyễn Văn A"
            disabled={isPending}
            className="dark:bg-slate-800 dark:border-slate-700 focus-visible:ring-[#0D9488]"
          />
          {form.formState.errors.full_name && (
            <p className="text-red-500 text-xs">{form.formState.errors.full_name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium text-[#134E4A] dark:text-slate-300">Username</label>
          <Input
            id="username"
            {...form.register("username")}
            placeholder="nguyen_van_a"
            disabled={isPending}
            className="dark:bg-slate-800 dark:border-slate-700 focus-visible:ring-[#0D9488]"
          />
          {form.formState.errors.username && (
            <p className="text-red-500 text-xs">{form.formState.errors.username.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-[#134E4A] dark:text-slate-300">Email sinh viên</label>
          <Input
            id="email"
            {...form.register("email")}
            placeholder="sinhvien@school.edu.vn"
            disabled={isPending}
            type="email"
            className="dark:bg-slate-800 dark:border-slate-700 focus-visible:ring-[#0D9488]"
          />
          {form.formState.errors.email && (
            <p className="text-red-500 text-xs">{form.formState.errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-[#134E4A] dark:text-slate-300">Mật khẩu</label>
          <Input
            id="password"
            {...form.register("password")}
            type="password"
            disabled={isPending}
            placeholder="••••••••"
            className="dark:bg-slate-800 dark:border-slate-700 focus-visible:ring-[#0D9488]"
          />
          
          {/* Password Strength Meter */}
          {watchPassword.length > 0 && (
            <div className="mt-2 space-y-1">
              <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${strengthColor}`} 
                  style={{ width: `${passwordStrength}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 text-right">
                {passwordStrength < 50 ? 'Yếu' : passwordStrength < 100 ? 'Trung bình' : 'Mạnh'}
              </p>
            </div>
          )}

          {form.formState.errors.password && (
            <p className="text-red-500 text-xs">{form.formState.errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-[#134E4A] dark:text-slate-300">Nhập lại mật khẩu</label>
          <Input
            id="confirmPassword"
            {...form.register("confirmPassword")}
            type="password"
            disabled={isPending}
            placeholder="••••••••"
            className="dark:bg-slate-800 dark:border-slate-700 focus-visible:ring-[#0D9488]"
          />
          {form.formState.errors.confirmPassword && (
            <p className="text-red-500 text-xs">{form.formState.errors.confirmPassword.message}</p>
          )}
        </div>

        {error && <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-md">{error}</div>}
        {success && <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm rounded-md">{success}</div>}

        <Button 
          type="submit" 
          className="w-full bg-[#0D9488] hover:bg-[#0f766e] text-white transition-colors duration-200 font-medium cursor-pointer" 
          disabled={isPending}
        >
          {isPending ? "Đang xử lý..." : "Đăng ký"}
        </Button>
      </form>

      <div className="text-center text-sm font-body text-slate-600 dark:text-slate-400">
        Đã có tài khoản? <Link href="/login" className="font-semibold text-[#0D9488] dark:text-[#2DD4BF] hover:underline cursor-pointer">Đăng nhập</Link>
      </div>
    </div>
  );
}

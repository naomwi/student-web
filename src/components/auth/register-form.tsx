"use client";

import { useTransition, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/schemas/auth";
import { signupAction } from "@/actions/auth-actions";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SocialButtons } from "./social-button";

export function RegisterForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { email: "", username: "", password: "", confirmPassword: "", full_name: "" },
  });

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

  return (
    <div className="mx-auto w-full max-w-md space-y-6 p-8 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-gray-100 dark:border-slate-800">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Tạo tài khoản mới</h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-2">Tham gia cộng đồng sinh viên ngay hôm nay</p>
      </div>

      <SocialButtons />

      <div className="relative">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200 dark:border-slate-800" /></div>
        <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-slate-900 px-2 text-gray-500 dark:text-slate-400">Hoặc đăng ký bằng email</span></div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium dark:text-slate-300">Họ và tên</label>
          <Input 
            {...form.register("full_name")} 
            placeholder="Nguyễn Văn A" 
            disabled={isPending}
            className="dark:bg-slate-800 dark:border-slate-700"
          />
          {form.formState.errors.full_name && (
            <p className="text-red-500 text-xs">{form.formState.errors.full_name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium dark:text-slate-300">Username (Tên đăng nhập)</label>
          <Input 
            {...form.register("username")} 
            placeholder="nguyen_van_a" 
            disabled={isPending}
            className="dark:bg-slate-800 dark:border-slate-700"
          />
          {form.formState.errors.username && (
            <p className="text-red-500 text-xs">{form.formState.errors.username.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium dark:text-slate-300">Email sinh viên</label>
          <Input 
            {...form.register("email")} 
            placeholder="sinhvien@school.edu.vn" 
            disabled={isPending}
            type="email"
            className="dark:bg-slate-800 dark:border-slate-700"
          />
          {form.formState.errors.email && (
            <p className="text-red-500 text-xs">{form.formState.errors.email.message}</p>
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

        <div className="space-y-2">
          <label className="text-sm font-medium dark:text-slate-300">Nhập lại mật khẩu</label>
          <Input 
            {...form.register("confirmPassword")} 
            type="password" 
            disabled={isPending}
            placeholder="••••••••" 
            className="dark:bg-slate-800 dark:border-slate-700"
          />
           {form.formState.errors.confirmPassword && (
            <p className="text-red-500 text-xs">{form.formState.errors.confirmPassword.message}</p>
          )}
        </div>

        {error && <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-md">{error}</div>}
        {success && <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm rounded-md">{success}</div>}

        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" disabled={isPending}>
          {isPending ? "Đang xử lý..." : "Đăng ký"}
        </Button>
      </form>
      
      <div className="text-center text-sm dark:text-slate-400">
        Đã có tài khoản? <a href="/login" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">Đăng nhập</a>
      </div>
    </div>
  );
}

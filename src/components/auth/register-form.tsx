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
    <div className="mx-auto w-full max-w-md space-y-6 p-8 bg-white rounded-xl shadow-lg border border-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Tạo tài khoản mới</h1>
        <p className="text-sm text-gray-500 mt-2">Tham gia cộng đồng sinh viên ngay hôm nay</p>
      </div>

      <SocialButtons />

      <div className="relative">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
        <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-500">Hoặc đăng ký bằng email</span></div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Họ và tên</label>
          <Input 
            {...form.register("full_name")} 
            placeholder="Nguyễn Văn A" 
            disabled={isPending}
          />
          {form.formState.errors.full_name && (
            <p className="text-red-500 text-xs">{form.formState.errors.full_name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Username (Tên đăng nhập)</label>
          <Input 
            {...form.register("username")} 
            placeholder="nguyen_van_a" 
            disabled={isPending}
          />
          {form.formState.errors.username && (
            <p className="text-red-500 text-xs">{form.formState.errors.username.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Email sinh viên</label>
          <Input 
            {...form.register("email")} 
            placeholder="sinhvien@school.edu.vn" 
            disabled={isPending}
            type="email"
          />
          {form.formState.errors.email && (
            <p className="text-red-500 text-xs">{form.formState.errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Mật khẩu</label>
          <Input 
            {...form.register("password")} 
            type="password" 
            disabled={isPending}
            placeholder="••••••••" 
          />
           {form.formState.errors.password && (
            <p className="text-red-500 text-xs">{form.formState.errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Nhập lại mật khẩu</label>
          <Input 
            {...form.register("confirmPassword")} 
            type="password" 
            disabled={isPending}
            placeholder="••••••••" 
          />
           {form.formState.errors.confirmPassword && (
            <p className="text-red-500 text-xs">{form.formState.errors.confirmPassword.message}</p>
          )}
        </div>

        {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md">{error}</div>}
        {success && <div className="p-3 bg-green-50 text-green-600 text-sm rounded-md">{success}</div>}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Đang xử lý..." : "Đăng ký"}
        </Button>
      </form>
      
      <div className="text-center text-sm">
        Đã có tài khoản? <a href="/login" className="font-semibold text-blue-600 hover:underline">Đăng nhập</a>
      </div>
    </div>
  );
}

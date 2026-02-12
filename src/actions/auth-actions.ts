"use server";

import { createClient } from "@/lib/supabase/server";
import { LoginSchema, RegisterSchema } from "@/schemas/auth";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function loginAction(values: z.infer<typeof LoginSchema>) {
  const supabase = await createClient();
  
  const validated = LoginSchema.safeParse(values);
  if (!validated.success) {
    return { error: "Dữ liệu không hợp lệ" };
  }

  const { identifier, password } = validated.data;
  let email = identifier;

  // Check if identifier is email, if not, treat as username and find email
  const isEmail = z.string().email().safeParse(identifier).success;
  
  if (!isEmail) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("email")
      .eq("username", identifier)
      .single();
    
    if (!profile) {
      return { error: "Username không tồn tại." };
    }
    email = profile.email;
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error(error);
    return { error: "Thông tin đăng nhập không chính xác." };
  }

  redirect("/dashboard");
}

export async function signupAction(values: z.infer<typeof RegisterSchema>) {
  const supabase = await createClient();
  
  const validated = RegisterSchema.safeParse(values);
  if (!validated.success) {
    return { error: validated.error.issues[0]?.message || "Dữ liệu đăng ký không hợp lệ" };
  }

  const { email, password, full_name, username } = validated.data;

  // Check if username exists
  const { data: existingUser } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", username)
    .single();

  if (existingUser) {
    return { error: "Username đã được sử dụng. Vui lòng chọn tên khác." };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: full_name,
        username: username, // Pass username to metadata
        role: 'member',
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Vui lòng kiểm tra email để xác thực tài khoản!" };
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

const ChangePasswordSchema = z.object({
  password: z.string().min(8, "Mật khẩu mới phải có ít nhất 8 ký tự").regex(/[A-Z]/, "Cần 1 chữ hoa").regex(/[0-9]/, "Cần 1 số"),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Mật khẩu không khớp",
  path: ["confirmPassword"]
});

export async function updatePasswordAction(prevState: any, formData: FormData) {
  const supabase = await createClient();
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  const validated = ChangePasswordSchema.safeParse({ password, confirmPassword });

  if (!validated.success) {
    return { error: validated.error.issues[0]?.message };
  }

  const { error } = await supabase.auth.updateUser({
    password: validated.data.password
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Đổi mật khẩu thành công!" };
}
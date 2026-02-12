import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
  .regex(/[A-Z]/, "Mật khẩu phải chứa ít nhất 1 chữ hoa")
  .regex(/[0-9]/, "Mật khẩu phải chứa ít nhất 1 số");

export const LoginSchema = z.object({
  identifier: z.string().min(1, "Vui lòng nhập Email hoặc Username"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

export const RegisterSchema = z.object({
  email: z.string().email("Email không đúng định dạng"),
  username: z.string().min(3, "Username tối thiểu 3 ký tự").regex(/^[a-zA-Z0-9_]+$/, "Username chỉ chứa chữ, số và _"),
  password: passwordSchema,
  confirmPassword: z.string(),
  full_name: z.string().min(2, "Tên hiển thị quá ngắn"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu nhập lại không khớp",
  path: ["confirmPassword"],
});

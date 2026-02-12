import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-white text-center">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
        Cộng đồng Sinh viên <span className="text-blue-600">UniConnect</span>
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl">
        Nơi chia sẻ kiến thức, tài liệu và kết nối học tập dành cho sinh viên.
      </p>
      <div className="flex gap-4">
        <Link href="/login">
          <Button size="lg">Đăng nhập ngay</Button>
        </Link>
        <Link href="/register">
          <Button variant="outline" size="lg">Đăng ký thành viên</Button>
        </Link>
      </div>
    </main>
  );
}
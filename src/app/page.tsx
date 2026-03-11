import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-[#F0FDFA] dark:bg-[#1a2332] text-center font-body">
      <h1 className="text-4xl font-display font-extrabold tracking-tight lg:text-5xl mb-6 text-[#1a2332] dark:text-white">
        Cộng đồng Sinh viên <span className="text-[#0D9488] dark:text-[#2DD4BF]">UniConnect</span>
      </h1>
      <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl">
        Nơi chia sẻ kiến thức, tài liệu và kết nối học tập dành cho sinh viên.
      </p>
      <div className="flex gap-4">
        <Link href="/login">
          <Button size="lg" className="bg-[#0D9488] hover:bg-[#0f766e] text-white">Đăng nhập ngay</Button>
        </Link>
        <Link href="/register">
          <Button variant="outline" size="lg" className="border-[#0D9488] text-[#0D9488] hover:bg-[#0D9488]/10 dark:border-[#2DD4BF] dark:text-[#2DD4BF] dark:hover:bg-[#2DD4BF]/10">Đăng ký thành viên</Button>
        </Link>
      </div>
    </main>
  );
}
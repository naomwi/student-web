import { RegisterForm } from "@/components/auth/register-form";
import { Sparkles, Users, BookOpen, MessageCircle } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-[#1a2332]">
      {/* Right Panel - Hidden on mobile, animated gradient on desktop (Reversed from Login) */}
      <div className="hidden md:flex md:w-1/2 login-panel-gradient p-12 flex-col justify-between text-white md:order-2">
        <div>
          <div className="flex items-center gap-2 mb-12">
            <Sparkles size={32} className="text-[#2DD4BF]" />
            <span className="text-2xl font-bold font-display">UniConnect</span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold font-display leading-tight mb-6">
            Lợi ích khi<br />tham gia
          </h1>
          
          <div className="space-y-8 mt-12 font-body">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                <Users className="text-[#2DD4BF]" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Cộng đồng sôi động</h3>
                <p className="text-white/80">Kết nối với hàng ngàn sinh viên</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                <BookOpen className="text-[#2DD4BF]" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Chia sẻ tài liệu</h3>
                <p className="text-white/80">Truy cập kho tài nguyên không giới hạn</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                <MessageCircle className="text-[#2DD4BF]" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Hỗ trợ 24/7</h3>
                <p className="text-white/80">Hỏi đáp trực tuyến, gia sư AI</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-sm text-white/60 font-body">
          © {new Date().getFullYear()} UniConnect. Bảo lưu mọi quyền.
        </div>
      </div>

      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 md:order-1">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="md:hidden flex flex-col items-center mb-8">
             <div className="flex items-center gap-2 mb-2">
                <Sparkles size={28} className="text-[#0D9488] dark:text-[#2DD4BF]" />
                <span className="text-2xl font-bold text-slate-900 dark:text-white font-display">UniConnect</span>
             </div>
             <p className="text-slate-500 dark:text-slate-400 font-body text-sm">Học tập & Kết nối</p>
          </div>
          
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}

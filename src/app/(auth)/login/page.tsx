import { LoginForm } from "@/components/auth/login-form";
import { BookOpen, MessageCircle, TrendingUp, GraduationCap } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F0FDFA] dark:bg-[#1a2332]">
      {/* Left Panel - Hidden on mobile, animated gradient on desktop */}
      <div className="hidden md:flex md:w-1/2 login-panel-gradient p-12 flex-col justify-between text-white">
        <div>
          <div className="flex items-center gap-2 mb-12">
            <GraduationCap size={32} className="text-[#2DD4BF]" />
            <span className="text-2xl font-bold font-plus-jakarta">HọcTốt</span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold font-plus-jakarta leading-tight mb-6">
            Nơi học tập<br />thông minh hơn
          </h1>
          
          <div className="space-y-8 mt-12 font-lato">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                <BookOpen className="text-[#2DD4BF]" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Kho bài học đa dạng</h3>
                <p className="text-white/80">Hàng ngàn bài giảng chất lượng cao</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                <MessageCircle className="text-[#2DD4BF]" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Chat & thảo luận nhóm</h3>
                <p className="text-white/80">Tương tác trực tiếp với bạn học và AI</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                <TrendingUp className="text-[#2DD4BF]" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Theo dõi tiến độ</h3>
                <p className="text-white/80">Phân tích lộ trình học tập cá nhân</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-sm text-white/60 font-lato">
          © {new Date().getFullYear()} HọcTốt. Bảo lưu mọi quyền.
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          {/* Mobile Header (Only visible on small screens) */}
          <div className="md:hidden flex flex-col items-center mb-8">
             <div className="flex items-center gap-2 mb-2">
                <GraduationCap size={28} className="text-[#0D9488] dark:text-[#2DD4BF]" />
                <span className="text-2xl font-bold text-slate-900 dark:text-white font-plus-jakarta">HọcTốt</span>
             </div>
             <p className="text-slate-500 dark:text-slate-400 font-lato text-sm">Nơi học tập thông minh hơn</p>
          </div>
          
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

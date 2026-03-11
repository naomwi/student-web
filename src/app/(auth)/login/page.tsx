import { LoginForm } from "@/components/auth/login-form";
import { BookOpen, MessageCircle, TrendingUp, GraduationCap } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-[#1a2332]">
      {/* Left Panel - Hidden on mobile, animated gradient on desktop */}
      <div className="hidden md:flex md:w-1/2 login-panel-gradient p-12 flex-col justify-between text-white relative overflow-hidden">
        
        {/* Film Strip Background Effect */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none flex justify-center items-center transform -rotate-12 scale-150">
          {/* Strip 1 */}
          <div className="w-64 h-[300%] flex flex-col gap-4 animate-scroll-film mr-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="relative w-full h-40 bg-black/60 border-x-8 border-black flex flex-col justify-between py-2 shrink-0 shadow-2xl">
                 {/* Top sprockets */}
                 <div className="w-full flex justify-around px-2">
                    {Array.from({length: 6}).map((_, j) => <div key={j} className="w-3 h-2.5 bg-white/40 rounded-sm"></div>)}
                 </div>
                 {/* Image */}
                 <div className="absolute inset-y-7 inset-x-2 bg-black overflow-hidden">
                    <img src="/bg/fptu-hcm.png" alt="FPT Background" className="w-full h-full object-cover opacity-70 grayscale contrast-125" />
                 </div>
                 {/* Bottom sprockets */}
                 <div className="w-full flex justify-around px-2">
                    {Array.from({length: 6}).map((_, j) => <div key={j} className="w-3 h-2.5 bg-white/40 rounded-sm"></div>)}
                 </div>
              </div>
            ))}
          </div>
          {/* Strip 2 */}
          <div className="w-64 h-[300%] flex flex-col gap-4 animate-scroll-film" style={{ animationDelay: '-15s' }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="relative w-full h-40 bg-black/60 border-x-8 border-black flex flex-col justify-between py-2 shrink-0 shadow-2xl">
                 {/* Top sprockets */}
                 <div className="w-full flex justify-around px-2">
                    {Array.from({length: 6}).map((_, j) => <div key={j} className="w-3 h-2.5 bg-white/40 rounded-sm"></div>)}
                 </div>
                 {/* Image */}
                 <div className="absolute inset-y-7 inset-x-2 bg-black overflow-hidden">
                    <img src="/bg/fptu-hcm.png" alt="FPT Background" className="w-full h-full object-cover opacity-70 grayscale contrast-125" />
                 </div>
                 {/* Bottom sprockets */}
                 <div className="w-full flex justify-around px-2">
                    {Array.from({length: 6}).map((_, j) => <div key={j} className="w-3 h-2.5 bg-white/40 rounded-sm"></div>)}
                 </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-12">
            <GraduationCap size={32} className="text-[#2DD4BF]" />
            <span className="text-2xl font-bold font-plus-jakarta">UniConnect</span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold font-plus-jakarta leading-tight mb-6">
            Nơi học tập<br />thông minh hơn
          </h1>
          
          <div className="space-y-8 mt-12 font-lato">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md border border-white/10 shadow-xl">
                <BookOpen className="text-[#2DD4BF]" />
              </div>
              <div>
                <h3 className="font-semibold text-lg drop-shadow-md">Kho bài học đa dạng</h3>
                <p className="text-white/90 font-medium">Hàng ngàn bài giảng chất lượng cao</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md border border-white/10 shadow-xl">
                <MessageCircle className="text-[#2DD4BF]" />
              </div>
              <div>
                <h3 className="font-semibold text-lg drop-shadow-md">Chat & thảo luận nhóm</h3>
                <p className="text-white/90 font-medium">Tương tác trực tiếp với bạn học và AI</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md border border-white/10 shadow-xl">
                <TrendingUp className="text-[#2DD4BF]" />
              </div>
              <div>
                <h3 className="font-semibold text-lg drop-shadow-md">Theo dõi tiến độ</h3>
                <p className="text-white/90 font-medium">Phân tích lộ trình học tập cá nhân</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-sm text-white/80 font-medium font-lato relative z-10">
          © {new Date().getFullYear()} UniConnect. Bảo lưu mọi quyền.
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

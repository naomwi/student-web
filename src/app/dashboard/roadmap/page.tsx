import { Map, CheckCircle2 } from "lucide-react";

export default function RoadmapPage() {
  const roadmaps = [
    {
      year: "Năm 1",
      completed: true,
      semesters: [
        { name: "Học kỳ 1", subjects: ["Nhập môn Lập trình", "Giải tích 1", "Đại số tuyến tính", "Tiếng Anh 1"] },
        { name: "Học kỳ 2", subjects: ["Kỹ thuật Lập trình", "Giải tích 2", "Vật lý đại cương", "Tiếng Anh 2"] },
      ]
    },
    {
      year: "Năm 2",
      active: true,
      semesters: [
        { name: "Học kỳ 3", subjects: ["Cấu trúc dữ liệu & Giải thuật", "Kiến trúc máy tính", "Toán rời rạc", "Mạng máy tính"] },
        { name: "Học kỳ 4", subjects: ["Cơ sở dữ liệu", "Hệ điều hành", "Lập trình hướng đối tượng", "Xác suất thống kê"] },
      ]
    },
    {
      year: "Năm 3 (Chuyên ngành)",
      semesters: [
        { name: "Học kỳ 5", subjects: ["Công nghệ phần mềm", "Lập trình Web", "Trí tuệ nhân tạo", "An toàn thông tin"] },
        { name: "Học kỳ 6", subjects: ["Phát triển ứng dụng di động", "Máy học", "Điện toán đám mây", "Thực tập cơ sở"] },
      ]
    },
    {
      year: "Năm 4 (Tốt nghiệp)",
      semesters: [
        { name: "Học kỳ 7", subjects: ["Thực tập tốt nghiệp", "Chuyên đề tốt nghiệp", "Quản lý dự án"] },
        { name: "Học kỳ 8", subjects: ["Đồ án tốt nghiệp", "Khởi nghiệp đổi mới sáng tạo"] },
      ]
    }
  ];

  return (
    <div className="space-y-8 pb-10 font-body">
      <div>
        <h2 className="text-3xl font-display font-bold text-[#1a2332] dark:text-slate-100 tracking-tight flex items-center gap-3">
          <Map className="h-8 w-8 text-[#0D9488]" strokeWidth={1.5} />
          Lộ trình học tập (CNTT)
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Bản đồ môn học tham khảo cho sinh viên Công nghệ thông tin.</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 mb-8 overflow-hidden">
        <div className="bg-[#0D9488] h-2.5 rounded-full transition-all duration-1000" style={{ width: '35%' }}></div>
      </div>

      <div className="relative border-l-2 border-[#2DD4BF] dark:border-[#0D9488]/50 ml-6 space-y-12 pb-8">
        {roadmaps.map((year, idx) => (
          <div key={idx} className="relative pl-10">
            {/* Timeline Dot */}
            {year.completed ? (
              <div className="absolute -left-[17px] top-0 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center p-0.5">
                 <CheckCircle2 className="h-7 w-7 text-[#0D9488] dark:text-[#2DD4BF] fill-[#F0FDFA] dark:fill-[#0D9488]/20" />
              </div>
            ) : year.active ? (
              <div className="absolute -left-[14px] top-1 bg-white dark:bg-slate-900 border-4 border-[#2DD4BF] dark:border-[#0D9488] w-6 h-6 rounded-full step-active"></div>
            ) : (
              <div className="absolute -left-[14px] top-1 bg-white dark:bg-slate-900 border-4 border-slate-300 dark:border-slate-700 w-6 h-6 rounded-full"></div>
            )}

            <h3 className={`text-xl font-display font-bold mb-6 ${year.completed || year.active ? 'text-[#0D9488] dark:text-[#2DD4BF]' : 'text-slate-500'}`}>
              {year.year}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {year.semesters.map((sem, sIdx) => (
                <div key={sIdx} className="bg-white dark:bg-[#1a2332] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-[#2DD4BF] dark:hover:border-[#0D9488]/50 hover:shadow-md transition">
                  <h4 className="font-display font-bold text-[#1a2332] dark:text-slate-200 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800/50">
                    {sem.name}
                  </h4>
                  <ul className="space-y-3">
                    {sem.subjects.map((sub, subIdx) => (
                      <li key={subIdx} className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-3">
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${year.completed ? 'bg-[#0D9488]' : year.active && sIdx === 0 ? 'bg-amber-400' : 'bg-slate-300 dark:bg-slate-600'}`}></span>
                        {sub}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

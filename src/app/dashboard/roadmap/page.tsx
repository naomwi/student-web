import { Map, CheckCircle2 } from "lucide-react";

export default function RoadmapPage() {
  const roadmaps = [
    {
      year: "Giai đoạn chuẩn bị",
      completed: true,
      semesters: [
        { name: "Học kỳ 0", subjects: ["OTP101 - Định hướng & Rèn luyện", "PEN - Tiếng Anh chuẩn bị", "PHE_COM*1 - Giáo dục thể chất 1", "TMI_ELE - Nhạc cụ truyền thống"] }
      ]
    },
    {
      year: "Năm 1 (Cơ sở ngành)",
      completed: true,
      semesters: [
        { name: "Học kỳ 1", subjects: ["CSI106 - Nhập môn KHMT", "MAD101 - Toán rời rạc", "MAE101 - Toán cho kỹ thuật", "PFP191 - Cơ sở lập trình Python", "PHE_COM*2 - Giáo dục thể chất 2", "SSA101 - Kỹ năng học thuật"] },
        { name: "Học kỳ 2", subjects: ["AIG202c - Trí tuệ nhân tạo", "CEA201 - Kiến trúc máy tính", "CSD203 - Cấu trúc dữ liệu (Python)", "DBI202 - Cơ sở dữ liệu", "JPD113 - Tiếng Nhật sơ cấp 1-A1.1", "PHE_COM*3 - Giáo dục thể chất 3"] },
        { name: "Học kỳ 3", subjects: ["ADY201m - TTNT & KHDL Python/SQL", "ITE303c - Đạo đức trong CNTT", "JPD123 - Tiếng Nhật sơ cấp 1-A1.2", "MAI391 - Toán cho học máy", "MAS291 - Xác suất thống kê"] },
      ]
    },
    {
      year: "Năm 2 (Chuyên ngành & OJT)",
      active: true,
      semesters: [
        { name: "Học kỳ 4", subjects: ["AIL303m - Học máy (Machine Learning)", "CPV301 - Thị giác máy tính", "DAP391m - Dự án TTNT-KHDL", "SSG105 - Kỹ năng giao tiếp", "SWE201c - Nhập môn Kỹ thuật phần mềm"] },
        { name: "Học kỳ 5", subjects: ["AI17.COM*1 - Học phần Combo 1", "AI17.COM*2 - Học phần Combo 2", "DPL302m - Học sâu (Deep Learning)", "DWP301c - Web với Python"] },
        { name: "Học kỳ 6", subjects: ["NLP301c - Xử lý ngôn ngữ tự nhiên", "OJT202 - Thực tập thực tế (OJT)"] },
      ]
    },
    {
      year: "Năm 3 (Tốt nghiệp)",
      semesters: [
        { name: "Học kỳ 7", subjects: ["AI17.COM*3 - Học phần Combo 3", "DAT301m - Phát triển AI với TensorFlow", "ENW493c - Phương pháp nghiên cứu", "EXE101 - Trải nghiệm khởi nghiệp 1", "PMG201c - Quản lý dự án"] },
        { name: "Học kỳ 8", subjects: ["AI17.COM*4 - Học phần Combo 4", "AID301c - Thiết kế sản phẩm AI", "EXE201 - Trải nghiệm khởi nghiệp 2", "MLN111 - Triết học Mác-Lênin", "MLN122 - Kinh tế chính trị", "REL301m - Học tăng cường"] },
        { name: "Học kỳ 9", subjects: ["AI17.GRA_ELE - Đồ án tốt nghiệp (AI)", "HCM202 - Tư tưởng Hồ Chí Minh", "MLN131 - CNXH Khoa học", "VNR202 - Lịch sử Đảng"] },
      ]
    }
  ];

  return (
    <div className="space-y-8 pb-10 font-body">
      <div>
        <h2 className="text-3xl font-display font-bold text-[#1a2332] dark:text-slate-100 tracking-tight flex items-center gap-3">
          <Map className="h-8 w-8 text-[#0D9488]" strokeWidth={1.5} />
          Lộ trình học tập (Chuyên ngành AI)
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Bản đồ môn học tham khảo cho sinh viên chuyên ngành Trí Tuệ Nhân Tạo (AI17).</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 mb-8 overflow-hidden">
        <div className="bg-[#0D9488] h-2.5 rounded-full transition-all duration-1000" style={{ width: '45%' }}></div>
      </div>

      <div className="relative border-l-2 border-[#2DD4BF] dark:border-[#0D9488]/50 ml-6 space-y-12 pb-8">
        {roadmaps.map((year, idx) => (
          <div key={idx} className="relative pl-10">
            {/* Timeline Dot */}
            {year.completed ? (
              <div className="absolute -left-[17px] top-0 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center p-0.5">
                 <CheckCircle2 className="h-7 w-7 text-[#0D9488] dark:text-[#2DD4BF] fill-slate-50 dark:fill-[#0D9488]/20" />
              </div>
            ) : year.active ? (
              <div className="absolute -left-[14px] top-1 bg-white dark:bg-slate-900 border-4 border-[#2DD4BF] dark:border-[#0D9488] w-6 h-6 rounded-full step-active"></div>
            ) : (
              <div className="absolute -left-[14px] top-1 bg-white dark:bg-slate-900 border-4 border-slate-300 dark:border-slate-700 w-6 h-6 rounded-full"></div>
            )}

            <h3 className={`text-xl font-display font-bold mb-6 ${year.completed || year.active ? 'text-[#0D9488] dark:text-[#2DD4BF]' : 'text-slate-500'}`}>
              {year.year}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {year.semesters.map((sem, sIdx) => (
                <div key={sIdx} className="bg-white dark:bg-[#1a2332] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-[#2DD4BF] dark:hover:border-[#0D9488]/50 hover:shadow-md transition flex flex-col">
                  <h4 className="font-display font-bold text-[#1a2332] dark:text-slate-200 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800/50">
                    {sem.name}
                  </h4>
                  <ul className="space-y-3 flex-1">
                    {sem.subjects.map((sub, subIdx) => (
                      <li key={subIdx} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-3">
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${year.completed ? 'bg-[#0D9488]' : year.active && sIdx === 0 ? 'bg-amber-400' : 'bg-slate-300 dark:bg-slate-600'}`}></span>
                        <span className="leading-snug">{sub}</span>
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

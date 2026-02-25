import { Map } from "lucide-react";

export default function RoadmapPage() {
  const roadmaps = [
    {
      year: "Năm 1",
      semesters: [
        { name: "Học kỳ 1", subjects: ["Nhập môn Lập trình", "Giải tích 1", "Đại số tuyến tính", "Tiếng Anh 1"] },
        { name: "Học kỳ 2", subjects: ["Kỹ thuật Lập trình", "Giải tích 2", "Vật lý đại cương", "Tiếng Anh 2"] },
      ]
    },
    {
      year: "Năm 2",
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
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-3">
          <Map className="h-8 w-8 text-rose-600" strokeWidth={1.5} />
          Lộ trình học tập (CNTT)
        </h2>
        <p className="text-slate-500 mt-2">Bản đồ môn học tham khảo cho sinh viên Công nghệ thông tin.</p>
      </div>

      <div className="relative border-l-4 border-slate-200 dark:border-slate-800 ml-6 space-y-12">
        {roadmaps.map((year, idx) => (
          <div key={idx} className="relative pl-8">
            {/* Timeline Dot */}
            <div className="absolute -left-[14px] top-0 bg-white dark:bg-slate-950 border-4 border-indigo-600 dark:border-indigo-400 w-6 h-6 rounded-full"></div>

            <h3 className="text-xl font-bold text-indigo-700 dark:text-indigo-400 mb-6">{year.year}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {year.semesters.map((sem, sIdx) => (
                <div key={sIdx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-md transition">
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4 pb-2 border-b border-slate-50 dark:border-slate-800">
                    {sem.name}
                  </h4>
                  <ul className="space-y-2">
                    {sem.subjects.map((sub, subIdx) => (
                      <li key={subIdx} className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
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

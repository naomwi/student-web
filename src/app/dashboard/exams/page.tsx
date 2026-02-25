import { createClient } from "@/lib/supabase/server";
import { DownloadBtn } from "@/components/documents/download-btn";
import { FileText, Filter, GraduationCap, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ExamBankPage({ searchParams }: { searchParams: Promise<{ year?: string }> }) {
  const params = await searchParams;
  const yearFilter = params.year;

  const supabase = await createClient();

  // Fetch tài liệu có category = 'exam'
  let query = supabase
    .from("documents")
    .select("*, profiles(full_name)")
    .eq("category", "exam") // Chỉ lấy đề thi
    .order("created_at", { ascending: false });

  // (Nếu có cột year trong documents thì filter, hiện tại chưa có nên demo fetch all)

  const { data: exams } = await query;

  const years = ["2023-2024", "2022-2023", "2021-2022"];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-3">
            <div className="bg-rose-100 p-2 rounded-lg">
              <GraduationCap className="h-8 w-8 text-rose-600" strokeWidth={1.5} />
            </div>
            Ngân hàng Đề thi
          </h2>
          <p className="text-slate-500 mt-2">Tổng hợp đề thi các năm, sắp xếp khoa học.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* Sidebar Filters */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm sticky top-8">
            <h3 className="font-bold mb-4 flex items-center text-slate-800 dark:text-slate-200">
              <Filter className="mr-2 h-4 w-4" /> Bộ lọc
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Năm học</label>
                <div className="space-y-1">
                  <Link href="/dashboard/exams" className={`block text-sm px-3 py-2 rounded-lg transition ${!yearFilter ? 'bg-indigo-50 text-indigo-700 font-medium' : 'hover:bg-slate-50 text-slate-600'}`}>
                    Tất cả
                  </Link>
                  {years.map(y => (
                    <Link key={y} href={`/dashboard/exams?year=${y}`} className={`block text-sm px-3 py-2 rounded-lg transition ${yearFilter === y ? 'bg-indigo-50 text-indigo-700 font-medium' : 'hover:bg-slate-50 text-slate-600'}`}>
                      {y}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Exam List */}
        <div className="lg:col-span-3">
          <div className="grid gap-4">
            {exams?.map((exam) => (
              <div key={exam.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-200 hover:shadow-md transition duration-300 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 group-hover:scale-110 transition">
                    <FileText className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 text-lg">{exam.file_name}</h4>
                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {new Date(exam.created_at).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" /> {(exam.profiles as any)?.full_name}
                      </span>
                      <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400 font-medium">
                        {(exam.file_size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  </div>
                </div>

                <DownloadBtn path={exam.storage_path} fileName={exam.file_name} />
              </div>
            ))}

            {(!exams || exams.length === 0) && (
              <div className="text-center py-16 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                <GraduationCap className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">Chưa có đề thi nào (hoặc đang cấu hình Database).</p>
                <p className="text-slate-400 text-sm">Hãy vào mục "Tài liệu" để upload và chọn danh mục Exam.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

import { getDocumentsService } from "@/services/document-service";
import { createClient } from "@/lib/supabase/server";
import { UploadZone } from "@/components/documents/upload-zone";
import { DownloadBtn } from "@/components/documents/download-btn";
import { DeleteDocBtn } from "@/components/documents/delete-doc-btn";
import { FileText, Search, FileImage, FileCode, FileIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";

function getFileBadge(fileName: string) {
  const ext = fileName.split('.').pop()?.toLowerCase();
  
  const map: Record<string, { color: string, icon: any, label: string }> = {
    pdf: { color: "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:border-rose-800 dark:text-rose-400", icon: FileText, label: "PDF" },
    docx: { color: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400", icon: FileText, label: "DOCX" },
    doc: { color: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400", icon: FileText, label: "DOC" },
    png: { color: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-400", icon: FileImage, label: "IMG" },
    jpg: { color: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-400", icon: FileImage, label: "IMG" },
    jpeg: { color: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-400", icon: FileImage, label: "IMG" },
    js: { color: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400", icon: FileCode, label: "CODE" },
    ts: { color: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400", icon: FileCode, label: "CODE" },
  };

  return map[ext || ""] || { color: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300", icon: FileIcon, label: ext?.toUpperCase() || "FILE" };
}

export default async function DocumentsPage({ searchParams }: { searchParams: Promise<{ q?: string; cat?: string }> }) {
  const params = await searchParams;
  const search = params.q || "";
  const category = params.cat || "all";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('username').eq('id', user.id).single();
    isAdmin = profile?.username === 'nao';
  }

  const docs = await getDocumentsService(search, category);

  return (
    <div className="space-y-8 font-body pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold tracking-tight text-[#1a2332] dark:text-white">Kho tài liệu</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Chia sẻ và tìm kiếm tài liệu ôn thi, bài giảng...</p>
        </div>
      </div>

      <UploadZone />

      {/* Search & Filter Toolbar */}
      <div className="bg-white dark:bg-[#1a2332] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4">
        <form className="flex-1 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              name="q"
              placeholder="Tìm kiếm tài liệu..."
              defaultValue={search}
              className="pl-9 bg-slate-50 dark:bg-slate-800/50 border-transparent focus:border-[#0D9488] focus-visible:ring-1 focus-visible:ring-[#0D9488] rounded-xl"
            />
          </div>
          <select
            name="cat"
            defaultValue={category}
            className="h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0D9488] text-slate-700 dark:text-slate-200"
          >
            <option value="all">Tất cả</option>
            <option value="cntt">CNTT</option>
            <option value="kinh_te">Kinh Tế</option>
            <option value="ngon_ngu">Ngoại Ngữ</option>
            <option value="khac">Khác</option>
          </select>
          <Button type="submit" className="bg-[#0D9488] hover:bg-[#0f766e] text-white rounded-xl shadow-md">Lọc</Button>
        </form>
      </div>

      {/* Results */}
      <div className="bg-white dark:bg-[#1a2332] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-white/5 flex justify-between items-center">
          <h3 className="font-display font-bold text-lg text-[#1a2332] dark:text-slate-200">Kết quả tìm kiếm ({docs.length})</h3>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {docs.map((doc) => {
            const badge = getFileBadge(doc.file_name);
            const Icon = badge.icon;
            
            return (
            <div key={doc.id} className="p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
              <div className="flex items-center space-x-4 min-w-0 flex-1 mr-4">
                <div className="h-12 w-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 shrink-0 group-hover:bg-white dark:group-hover:bg-[#1a2332] group-hover:shadow-sm border border-transparent group-hover:border-slate-200 dark:group-hover:border-slate-700 transition">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <p className="font-display font-bold text-base text-[#1a2332] dark:text-slate-200 line-clamp-1 break-all group-hover:text-[#0D9488] dark:group-hover:text-[#2DD4BF] transition" title={doc.file_name}>{doc.file_name}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {/* Anchor: Filetype color badge */}
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider border ${badge.color}`}>
                      {badge.label}
                    </span>
                    <span>•</span>
                    <span className="uppercase font-medium tracking-wide bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
                      {doc.category}
                    </span>
                    <span>•</span>
                    <span>{(doc.file_size / 1024 / 1024).toFixed(2)} MB</span>
                    <span>•</span>
                    <span>bởi <span className="font-medium text-slate-700 dark:text-slate-300">{(doc.profiles as any)?.full_name || "Ẩn danh"}</span></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <DownloadBtn path={doc.storage_path} fileName={doc.file_name} />
                {(user?.id === doc.uploader_id || isAdmin) && (
                  <DeleteDocBtn documentId={doc.id} storagePath={doc.storage_path} />
                )}
              </div>
            </div>
          )})}

          {docs.length === 0 && (
            <EmptyState 
              icon={<Search className="h-12 w-12 text-slate-300" />} 
              message="Không tìm thấy tài liệu phù hợp." 
            />
          )}
        </div>
      </div>
    </div>
  );
}

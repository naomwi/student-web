import { getDocumentsService } from "@/services/document-service";
import { createClient } from "@/lib/supabase/server";
import { UploadZone } from "@/components/documents/upload-zone";
import { DownloadBtn } from "@/components/documents/download-btn";
import { DeleteDocBtn } from "@/components/documents/delete-doc-btn";
import { FileText, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
    <div className="space-y-8">
      {/* Header & Upload */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Kho tài liệu học tập</h2>
          <p className="text-muted-foreground text-sm">Chia sẻ và tìm kiếm tài liệu ôn thi, bài giảng...</p>
        </div>
      </div>

      <UploadZone />

      {/* Search & Filter Toolbar */}
      <div className="bg-card p-4 rounded-lg border border-border shadow-sm flex flex-col md:flex-row gap-4">
        <form className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              name="q"
              placeholder="Tìm kiếm tài liệu..."
              defaultValue={search}
              className="pl-8 bg-background"
            />
          </div>
          <select
            name="cat"
            defaultValue={category}
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-foreground"
          >
            <option value="all">Tất cả danh mục</option>
            <option value="cntt">CNTT</option>
            <option value="kinh_te">Kinh Tế</option>
            <option value="ngon_ngu">Ngoại Ngữ</option>
            <option value="khac">Khác</option>
          </select>
          <Button type="submit">Lọc</Button>
        </form>
      </div>

      {/* Results */}
      <div className="bg-card rounded-lg border border-border shadow-sm">
        <div className="p-4 border-b border-border bg-muted/40 flex justify-between items-center">
          <h3 className="font-semibold text-sm text-foreground">Kết quả tìm kiếm ({docs.length})</h3>
        </div>

        <div className="divide-y divide-border">
          {docs.map((doc) => (
            <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition">
              <div className="flex items-center space-x-4 min-w-0 flex-1 mr-4">
                <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-foreground line-clamp-1 break-all" title={doc.file_name}>{doc.file_name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="bg-muted px-2 py-0.5 rounded uppercase border border-border">{doc.category}</span>
                    <span>•</span>
                    <span>{(doc.file_size / 1024 / 1024).toFixed(2)} MB</span>
                    <span>•</span>
                    <span>Upload bởi {(doc.profiles as any)?.full_name || "Ẩn danh"}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <DownloadBtn path={doc.storage_path} fileName={doc.file_name} />
                {(user?.id === doc.uploader_id || isAdmin) && (
                  <DeleteDocBtn documentId={doc.id} storagePath={doc.storage_path} />
                )}
              </div>
            </div>
          ))}

          {docs.length === 0 && (
            <div className="p-12 text-center">
              <div className="bg-muted h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground">Không tìm thấy tài liệu</h3>
              <p className="text-muted-foreground">Thử tìm kiếm với từ khóa khác.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

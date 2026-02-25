"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { saveDocumentMetadata } from "@/actions/document-actions";
import { UploadCloud, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function UploadZone() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState("khac");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    try {
      const supabase = createClient();
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("Chưa đăng nhập");

      const fileExt = file.name.split('.').pop();
      const uuidName = crypto.randomUUID();
      const filePath = `${user.id}/${uuidName}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("student-docs")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const result = await saveDocumentMetadata({
        fileName: file.name,
        storagePath: filePath,
        fileSize: file.size,
        mimeType: file.type,
        category: category,
      });

      if (result.error) throw new Error(result.error);

      alert("Upload thành công!");
      setFile(null);
    } catch (error: any) {
      alert(`Lỗi: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-lg p-8 text-center hover:bg-gray-50 dark:hover:bg-slate-800/50 transition">
      {!file ? (
        <>
          <UploadCloud className="mx-auto h-12 w-12 text-gray-400 dark:text-slate-500" />
          <p className="mt-2 text-sm text-gray-600 dark:text-slate-400">Kéo thả hoặc click để chọn tài liệu (PDF, Docx)</p>
          <input type="file" onChange={handleFileChange} className="hidden" id="file-upload" accept=".pdf,.docx,.doc" />
          <label htmlFor="file-upload" className="mt-4 inline-block cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Chọn File
          </label>
        </>
      ) : (
        <div className="flex flex-col md:flex-row items-center justify-between bg-blue-50 dark:bg-slate-900 border border-blue-100 dark:border-slate-800 p-4 rounded-md gap-4">
          <div className="flex items-center flex-1 w-full min-w-0">
            <File className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0" />
            <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{file.name}</span>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto mt-4 md:mt-0">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-10 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-600 outline-none"
            >
              <option value="khac">Khác</option>
              <option value="cntt">CNTT</option>
              <option value="kinh_te">Kinh Tế</option>
              <option value="ngon_ngu">Ngoại Ngữ</option>
              <option value="exam">Đề thi</option>
            </select>
            <Button onClick={handleUpload} disabled={uploading} className="whitespace-nowrap">
              {uploading ? "Đang tải lên..." : "Upload ngay"}
            </Button>
            <button onClick={() => setFile(null)} className="text-red-500 dark:text-red-400 p-2 hover:bg-red-50 dark:hover:bg-red-950/30 rounded flex-shrink-0"><X /></button>
          </div>
        </div>
      )}
    </div>
  );
}

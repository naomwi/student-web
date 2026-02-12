"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { saveDocumentMetadata } from "@/actions/document-actions";
import { UploadCloud, File, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function UploadZone() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

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
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 transition">
      {!file ? (
        <>
          <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">Kéo thả hoặc click để chọn tài liệu (PDF, Docx)</p>
          <input type="file" onChange={handleFileChange} className="hidden" id="file-upload" accept=".pdf,.docx,.doc" />
          <label htmlFor="file-upload" className="mt-4 inline-block cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Chọn File
          </label>
        </>
      ) : (
        <div className="flex items-center justify-between bg-blue-50 p-4 rounded-md">
          <div className="flex items-center">
            <File className="h-6 w-6 text-blue-600 mr-2" />
            <span className="text-sm font-medium">{file.name}</span>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleUpload} disabled={uploading}>
              {uploading ? "Đang tải lên..." : "Upload ngay"}
            </Button>
            <button onClick={() => setFile(null)} className="text-red-500"><X /></button>
          </div>
        </div>
      )}
    </div>
  );
}

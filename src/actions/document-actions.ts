"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveDocumentMetadata(fileData: {
  fileName: string;
  storagePath: string;
  fileSize: number;
  mimeType: string;
  category: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase.from("documents").insert({
    uploader_id: user.id,
    file_name: fileData.fileName,
    storage_path: fileData.storagePath,
    file_size: fileData.fileSize,
    mime_type: fileData.mimeType,
    category: fileData.category,
  });

  if (error) return { error: error.message };
  revalidatePath("/fptcolearn/documents");
  return { success: true };
}

export async function getDocumentDownloadUrl(storagePath: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .storage
    .from('student-docs')
    .createSignedUrl(storagePath, 60);

  if (error) return { error: "Không thể tạo liên kết tải." };
  return { url: data.signedUrl };
}

export async function deleteDocument(documentId: string, storagePath: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  // Kiểm tra quyền (chỉ người upload mới được xóa)
  const { data: doc } = await supabase
    .from("documents")
    .select("uploader_id")
    .eq("id", documentId)
    .single();

  const { data: profile } = await supabase.from('profiles').select('username').eq('id', user.id).single();
  const isAdmin = profile?.username === 'nao';

  if (!doc || (doc.uploader_id !== user.id && !isAdmin)) {
    return { error: "Không có quyền xóa biên bản này." };
  }

  // 1. Xóa file trong storage
  const { error: storageError } = await supabase.storage.from("student-docs").remove([storagePath]);

  if (storageError) {
    console.error("Storage Error:", storageError);
    return { error: "Lỗi khi xóa file đính kèm." };
  }

  // 2. Xóa record trong db
  const { error: dbError } = await supabase.from("documents").delete().eq("id", documentId);

  if (dbError) {
    console.error("DB Error:", dbError);
    return { error: "Lỗi hệ thống khi xóa dữ liệu." };
  }

  revalidatePath("/fptcolearn/documents");
  return { success: true, message: "Đã xóa tài liệu" };
}

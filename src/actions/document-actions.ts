"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveDocumentMetadata(fileData: {
  fileName: string;
  storagePath: string;
  fileSize: number;
  mimeType: string;
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
  });

  if (error) return { error: error.message };
  revalidatePath("/dashboard/documents");
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

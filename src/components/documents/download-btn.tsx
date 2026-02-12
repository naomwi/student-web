"use client";

import { getDocumentDownloadUrl } from "@/actions/document-actions";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function DownloadBtn({ path, fileName }: { path: string, fileName: string }) {
  const handleDownload = async () => {
    const result = await getDocumentDownloadUrl(path);
    if (result.url) {
      window.open(result.url, "_blank");
    } else {
      alert("Lỗi không tải được file");
    }
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleDownload}>
      <Download className="h-4 w-4 mr-2" /> Tải về
    </Button>
  );
}

"use client";

import { useState, useTransition } from "react";
import { createQuestion } from "@/actions/qa-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Loader2, Image as ImageIcon, X } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

export function CreateQuestionDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Xử lý upload ảnh
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const supabase = createClient();
    const user = (await supabase.auth.getUser()).data.user;

    if (!user) {
      toast.error("Vui lòng đăng nhập.");
      setIsUploading(false);
      return;
    }

    const newUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = `qa-images/${user.id}/${Date.now()}-${file.name}`;
      
      const { error } = await supabase.storage.from('student-docs').upload(filePath, file); // Dùng chung bucket public
      if (error) {
        toast.error(`Lỗi upload: ${error.message}`);
        continue;
      }

      const { data } = supabase.storage.from('student-docs').getPublicUrl(filePath);
      newUrls.push(data.publicUrl);
    }

    setUploadedImages([...uploadedImages, ...newUrls]);
    setIsUploading(false);
  };

  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const handleSubmit = (formData: FormData) => {
    // Gửi kèm danh sách ảnh (nối chuỗi)
    formData.append("images", uploadedImages.join(","));

    startTransition(async () => {
      try {
        const res = await createQuestion(null, formData);
        
        if (res?.success) {
          toast.success(res.success);
          setIsOpen(false);
          setUploadedImages([]);
        } else {
          toast.error(res?.error || "Có lỗi xảy ra, vui lòng thử lại.");
        }
      } catch (err) {
        console.error("Submission Error:", err);
        toast.error("Lỗi kết nối mạng.");
      }
    });
  };

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">
        <PlusCircle className="mr-2 h-4 w-4" /> Đặt câu hỏi
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 dark:border-slate-800 rounded-2xl p-8 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 border border-indigo-100 max-h-[90vh] overflow-y-auto">
        <h3 className="text-2xl font-serif font-bold mb-1 text-slate-800 dark:text-slate-100">Đặt câu hỏi mới</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Mô tả vấn đề của bạn để cộng đồng hỗ trợ.</p>
        
        <form action={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">Tiêu đề</label>
            <Input 
              name="title" 
              required 
              placeholder="Ví dụ: Làm sao để tính tích phân suy rộng?" 
              className="rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">Chi tiết vấn đề</label>
            <textarea 
               name="content" 
               className="w-full min-h-[120px] p-3 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm" 
               required 
               placeholder="Mô tả chi tiết, đính kèm code hoặc ảnh lỗi..."
            />
          </div>

          {/* Image Upload Section */}
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">Hình ảnh minh họa</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {uploadedImages.map((url, idx) => (
                <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 group">
                  <Image src={url} alt="Preview" fill className="object-cover" />
                  <button 
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl-lg opacity-0 group-hover:opacity-100 transition"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              
              <label className="w-16 h-16 flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                {isUploading ? <Loader2 className="h-5 w-5 animate-spin text-slate-400" /> : <ImageIcon className="h-5 w-5 text-slate-400" />}
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 block">Tags (cách nhau bởi dấu phẩy)</label>
            <Input 
              name="tags" 
              placeholder="Toán, Giải tích 1, C++" 
              className="rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} className="rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">Hủy</Button>
            <Button type="submit" disabled={isPending || isUploading} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl min-w-[120px]">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang đăng...
                </>
              ) : "Đăng câu hỏi"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

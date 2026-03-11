"use client";

import { updateProfile } from "@/actions/profile-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useState, useRef } from "react";
import { useEffect } from "react";
import { toast } from "sonner";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

type ActionState = {
  error?: string;
  success?: string;
};

const initialState: ActionState = {
  error: "",
  success: "",
};

export function ProfileForm({ profile }: { profile: any }) {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(updateProfile, initialState);
  
  // Crop state
  const [imgSrc, setImgSrc] = useState("");
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>("");
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
    if (state?.success) {
      toast.success(state.success);
    }
  }, [state]);

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Limit file size to 10MB
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Kích thước ảnh quá lớn. Vui lòng chọn ảnh dưới 10MB.");
        e.target.value = ""; // Reset input
        return;
      }

      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgSrc(reader.result?.toString() || "");
        setIsCropModalOpen(true);
      });
      reader.readAsDataURL(file);
    }
  }

  function getCroppedImg() {
    if (!imgRef.current || !crop) return;
    const image = imgRef.current;
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    const base64Image = canvas.toDataURL("image/jpeg");
    setCroppedImageUrl(base64Image);
    setIsCropModalOpen(false);
  }

  const handleAction = (formData: FormData) => {
    if (croppedImageUrl) {
      // Convert base64 to Blob
      const parts = croppedImageUrl.split(',');
      const base64Data = parts[1];
      const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
      
      const byteString = atob(base64Data);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mime });
      
      // Overwrite the avatar_file with the cropped blob
      formData.set('avatar_file', blob, 'avatar.jpg');
    }
    
    // Clean up to prevent sending huge base64 string
    formData.delete('cropped_avatar');
    
    formAction(formData);
  };

  return (
    <>
      <form action={handleAction} className="space-y-4 relative">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6 pb-6 border-b border-border">
          <div className="h-24 w-24 rounded-full bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-800 shadow-md overflow-hidden flex items-center justify-center shrink-0 relative group">
            {croppedImageUrl ? (
              <img src={croppedImageUrl} alt="Avatar Preview" className="h-full w-full object-cover object-center" />
            ) : profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover object-center" />
            ) : (
              <span className="text-3xl font-bold text-slate-400">{profile?.full_name?.[0] || "?"}</span>
            )}
            
            {/* Hidden input to submit the base64 cropped image */}
            <input type="hidden" name="cropped_avatar" value={croppedImageUrl} />
          </div>
          <div className="space-y-4 flex-1">
            <div className="space-y-1.5">
              <Label htmlFor="avatar_file" className="font-semibold text-foreground">Tải ảnh lên từ máy tính (Tối đa 10MB)</Label>
              <Input 
                name="avatar_file" 
                type="file" 
                accept="image/*"
                onChange={onSelectFile}
                className="w-full sm:w-[350px] cursor-pointer file:cursor-pointer file:text-primary file:bg-primary/10 file:border-0 file:rounded-md file:mr-4 file:px-4 file:py-1 hover:file:bg-primary/20 transition-all text-sm h-10"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="avatar_url" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Hoặc dùng URL ảnh</Label>
              <Input 
                name="avatar_url" 
                defaultValue={profile?.avatar_url || ""} 
                placeholder="https://example.com/avatar.jpg" 
                className="w-full sm:w-[350px] h-9 text-sm bg-slate-50 dark:bg-slate-900"
              />
            </div>
          </div>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="full_name">Họ và tên</Label>
          <Input 
            name="full_name" 
            defaultValue={profile?.full_name || ""} 
            placeholder="Nguyễn Văn A" 
            required 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username (Tên định danh)</Label>
          <Input 
            name="username" 
            defaultValue={profile?.username || ""} 
            placeholder="nguyen_van_a" 
            disabled={!!profile?.username}
            title={profile?.username ? "Username không thể thay đổi" : "Đặt username (chỉ một lần)"}
          />
          {profile?.username && <p className="text-[10px] text-muted-foreground">Username không thể thay đổi.</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="major">Chuyên ngành</Label>
          <Input 
            name="major" 
            defaultValue={profile?.major || ""} 
            placeholder="Ví dụ: Công nghệ thông tin..." 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="year">Năm học (1-10)</Label>
          <Input 
            name="year" 
            type="number" 
            min="1" 
            max="10" 
            defaultValue={profile?.year || 1} 
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Giới thiệu bản thân (Bio)</Label>
        <textarea 
          name="bio"
          className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
          placeholder="Sở thích, mục tiêu học tập..."
          defaultValue={profile?.bio || ""}
        />
      </div>

      <div className="pt-4 border-t border-border">
        <h3 className="font-semibold mb-4 flex items-center text-foreground">
          <span className="bg-indigo-100 text-indigo-700 p-1 rounded mr-2 text-xs font-bold">NEW</span> 
          Đăng ký làm Mentor
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="is_mentor" 
              name="is_mentor" 
              defaultChecked={profile?.is_mentor || false}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <Label htmlFor="is_mentor" className="font-medium">Tôi muốn đăng ký làm Mentor</Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin_url">LinkedIn Profile</Label>
                <Input 
                  name="linkedin_url" 
                  placeholder="https://linkedin.com/in/..." 
                  defaultValue={profile?.linkedin_url || ""} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="skills">Kỹ năng (cách nhau bởi dấu phẩy)</Label>
                <Input 
                  name="skills" 
                  placeholder="React, Node.js, IELTS 8.0..." 
                  defaultValue={profile?.skills?.join(", ") || ""} 
                />
              </div>
          </div>
        </div>
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Đang lưu..." : "Lưu thay đổi"}
      </Button>
    </form>

    {isCropModalOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-card p-6 rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in-95">
          <h3 className="text-lg font-bold mb-4">Căn chỉnh ảnh đại diện</h3>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl overflow-hidden flex justify-center border border-border mb-6">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              aspect={1} // Force square aspect ratio
              circularCrop // Show visual circle guide
            >
              <img ref={imgRef} src={imgSrc} alt="Upload preview" className="max-h-[400px] w-auto object-contain" />
            </ReactCrop>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsCropModalOpen(false)}>Hủy</Button>
            <Button onClick={getCroppedImg} className="bg-primary text-primary-foreground">Xác nhận cắt ảnh</Button>
          </div>
        </div>
      </div>
    )}
  </>
  );
}

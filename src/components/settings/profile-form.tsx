"use client";

import { updateProfile } from "@/actions/profile-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState } from "react"; // React 19
import { useEffect } from "react";
import { toast } from "sonner";

const initialState = {
  message: "",
  error: "",
  success: "",
};

export function ProfileForm({ profile }: { profile: any }) {
  const [state, formAction, isPending] = useActionState(updateProfile, initialState);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
    if (state?.success) {
      toast.success(state.success);
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
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
  );
}

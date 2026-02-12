"use client";

import { updatePasswordAction } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { Lock } from "lucide-react";

type ActionState = {
  error?: string;
  success?: string;
};

const initialState: ActionState = {
  error: "",
  success: "",
};

export function ChangePasswordForm() {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(updatePasswordAction, initialState);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
    if (state?.success) {
      toast.success(state.success);
    }
  }, [state]);

  return (
    <div className="bg-card p-6 rounded-lg border border-border shadow-sm mt-8">
      <h2 className="text-xl font-semibold mb-4 flex items-center text-foreground">
        <Lock className="mr-2 h-5 w-5 text-primary" /> Đổi mật khẩu
      </h2>
      
      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">Mật khẩu mới</Label>
          <Input 
            name="password" 
            type="password" 
            placeholder="••••••••" 
            required 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Nhập lại mật khẩu mới</Label>
          <Input 
            name="confirmPassword" 
            type="password" 
            placeholder="••••••••" 
            required 
          />
        </div>

        <Button type="submit" variant="outline" disabled={isPending} className="w-full">
          {isPending ? "Đang cập nhật..." : "Đổi mật khẩu"}
        </Button>
      </form>
    </div>
  );
}

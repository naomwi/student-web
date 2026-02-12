"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Github, Chrome } from "lucide-react";

export function SocialButtons() {
  const handleSocialLogin = async (provider: "google" | "github") => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <Button variant="outline" onClick={() => handleSocialLogin("github")}>
        <Github className="mr-2 h-4 w-4" /> GitHub
      </Button>
      <Button variant="outline" onClick={() => handleSocialLogin("google")}>
        <Chrome className="mr-2 h-4 w-4" /> Google
      </Button>
    </div>
  );
}

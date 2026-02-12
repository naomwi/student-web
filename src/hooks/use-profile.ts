"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export function useProfile() {
  const [profile, setProfile] = useState<any | null>(null);
  const [loading,XH] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        setProfile(data);
      }
      XH(false);
    };

    fetchProfile();
  }, []);

  return { profile, loading };
}

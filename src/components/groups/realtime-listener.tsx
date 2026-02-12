"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function RealtimeListener() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel('realtime-groups')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'study_group_members' },
        (payload) => {
          // Khi có người tham gia, refresh lại trang để cập nhật số lượng
          console.log("New member joined:", payload);
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, router]);

  return null; // Component này không render gì cả
}

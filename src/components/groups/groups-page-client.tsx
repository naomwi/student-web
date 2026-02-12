"use client";

import { useState } from "react";
import { CreateGroupForm } from "@/components/groups/create-group-form";
import { GroupCard } from "@/components/groups/group-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import { RealtimeListener } from "@/components/groups/realtime-listener";

export default function GroupsPageClient({ groups }: { groups: any[] }) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <RealtimeListener />
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold tracking-tight">Nhóm học tập</h2>
           <p className="text-gray-500 text-sm">Tìm bạn đồng hành cùng tiến bộ</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="mr-2 h-4 w-4" /> Tạo nhóm mới
        </Button>
      </div>

      {showForm && (
        <div className="bg-slate-50 border p-4 rounded-lg animate-in fade-in slide-in-from-top-2">
          <h3 className="font-bold mb-4">Thông tin nhóm mới</h3>
          <CreateGroupForm onClose={() => setShowForm(false)} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map(group => (
          <GroupCard key={group.id} group={group} />
        ))}
        
        {groups.length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-500">
            Chưa có nhóm nào. Hãy tạo nhóm đầu tiên!
          </div>
        )}
      </div>
    </div>
  );
}

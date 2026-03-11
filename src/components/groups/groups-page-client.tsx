"use client";

import { useState } from "react";
import { CreateGroupForm } from "@/components/groups/create-group-form";
import { GroupCard } from "@/components/groups/group-card";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";

import { RealtimeListener } from "@/components/groups/realtime-listener";
import { SectionHeader } from "@/components/shared/section-header";
import { EmptyState } from "@/components/shared/empty-state";

export default function GroupsPageClient({ groups }: { groups: any[] }) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6 font-body">
      <RealtimeListener />
      
      <div className="flex justify-between items-center mb-6">
        <div>
           <h2 className="text-3xl font-display font-bold text-[#1a2332] dark:text-white tracking-tight">Nhóm học tập</h2>
           <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Tìm bạn đồng hành cùng tiến bộ</p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="bg-[#0D9488] hover:bg-[#0f766e] text-white shadow-lg shadow-teal-500/20"
        >
          <Plus className="mr-2 h-4 w-4" /> Tạo nhóm mới
        </Button>
      </div>

      {showForm && (
        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl animate-in fade-in slide-in-from-top-4 mb-8">
          <h3 className="font-display font-bold text-lg mb-6 text-[#1a2332] dark:text-slate-200">Thông tin nhóm mới</h3>
          <CreateGroupForm onClose={() => setShowForm(false)} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map(group => (
          <GroupCard key={group.id} group={group} />
        ))}
        
        {groups.length === 0 && (
          <div className="col-span-full">
            <EmptyState 
              icon={<Users className="h-12 w-12 text-slate-300" />} 
              message="Chưa có nhóm nào. Hãy tạo nhóm đầu tiên!" 
            />
          </div>
        )}
      </div>
    </div>
  );
}

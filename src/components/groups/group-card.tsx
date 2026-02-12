"use client";

import { joinGroup } from "@/actions/group-actions";
import { Button } from "@/components/ui/button";
import { Users, MapPin, ExternalLink } from "lucide-react";
import { useTransition } from "react";

interface GroupProps {
  id: string;
  name: string;
  description: string;
  location: string;
  memberCount: number;
  isMember: boolean;
  meetingLink?: string;
}

export function GroupCard({ group }: { group: GroupProps }) {
  const [isPending, startTransition] = useTransition();

  const handleJoin = () => {
    startTransition(async () => {
      const res = await joinGroup(group.id);
      if (res?.error) alert(res.error);
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 dark:border-slate-800 p-5 rounded-lg border shadow-sm flex flex-col justify-between h-full hover:shadow-md transition">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-gray-900 dark:text-slate-100 line-clamp-1">{group.name}</h3>
          <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs px-2 py-1 rounded-full font-medium flex items-center">
            <Users className="h-3 w-3 mr-1" /> {group.memberCount}
          </span>
        </div>
        
        <p className="text-gray-500 dark:text-slate-400 text-sm mb-4 line-clamp-3 min-h-[60px]">
          {group.description || "Chưa có mô tả."}
        </p>

        <div className="space-y-2 mb-4 text-sm text-gray-600 dark:text-slate-300">
           <div className="flex items-center">
             <MapPin className="h-4 w-4 mr-2 text-gray-400 dark:text-slate-500" />
             {group.location || "Online"}
           </div>
           {group.isMember && group.meetingLink && (
             <a href={group.meetingLink} target="_blank" className="flex items-center text-blue-600 dark:text-blue-400 hover:underline">
               <ExternalLink className="h-4 w-4 mr-2" /> Link phòng họp
             </a>
           )}
        </div>
      </div>

      <Button 
        onClick={handleJoin} 
        disabled={group.isMember || isPending}
        variant={group.isMember ? "outline" : "default"}
        className="w-full"
      >
        {group.isMember ? "Đã tham gia" : (isPending ? "Đang tham gia..." : "Tham gia nhóm")}
      </Button>
    </div>
  );
}

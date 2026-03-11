import { createClient } from "@/lib/supabase/server";
import { Trophy, User } from "lucide-react";
import { getTierFromPoints } from "@/lib/level";

export async function Leaderboard() {
  const supabase = await createClient();

  const { data: topUsers } = await supabase
    .from("profiles")
    .select("id, full_name, reputation, avatar_url")
    .order("reputation", { ascending: false })
    .limit(5);

  return (
    <div className="bg-white dark:bg-slate-900 dark:border-slate-800 rounded-xl border border-slate-200 shadow-sm overflow-hidden h-fit font-body">
      <div className="p-4 border-b border-yellow-100 dark:border-slate-800 bg-yellow-50 dark:bg-slate-900/50 flex items-center">
        <Trophy className="mr-2 h-5 w-5 text-yellow-600 dark:text-yellow-500" />
        <h3 className="font-bold text-yellow-800 dark:text-yellow-500">Bảng xếp hạng năng nổ</h3>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {topUsers?.map((u, idx) => {
          const tier = getTierFromPoints(u.reputation);
          return (
          <div key={u.id || idx} className={`p-3 flex items-center justify-between hover:bg-yellow-50/30 dark:hover:bg-slate-800/50 transition ${idx === 0 ? 'bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl m-1' : ''}`}>
            <div className="flex items-center gap-3">
              <span className={`font-bold w-6 text-center flex justify-center ${idx === 0 ? 'text-yellow-600 dark:text-yellow-500 text-lg' : 'text-gray-500 dark:text-slate-500'}`}>
                {idx === 0 ? '🥇' : `#${idx + 1}`}
              </span>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-slate-700 overflow-hidden flex items-center justify-center shadow-sm">
                  {u.avatar_url ? (
                    <img src={u.avatar_url} className="h-full w-full object-cover" />
                  ) : (
                    <span className="font-display font-bold text-slate-500 dark:text-slate-300">{u.full_name?.charAt(0)}</span>
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                   <p className="font-semibold text-[15px] truncate max-w-[140px] dark:text-slate-200">{u.full_name}</p>
                   <p className="mt-1 flex items-center gap-1.5">
                      <span title={tier.name} className="text-sm">{tier.emoji}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tier.color} truncate`}>{tier.name}</span>
                   </p>
                </div>
              </div>
            </div>
            <span className="font-bold text-[15px] text-yellow-700 dark:text-yellow-500">{u.reputation} pts</span>
          </div>
        )})}
        {(!topUsers || topUsers.length === 0) && (
          <p className="p-4 text-sm text-gray-500 dark:text-slate-400 text-center">Chưa có dữ liệu xếp hạng.</p>
        )}
      </div>
    </div>
  );
}

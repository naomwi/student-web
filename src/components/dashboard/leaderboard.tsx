import { createClient } from "@/lib/supabase/server";
import { Trophy, User } from "lucide-react";

export async function Leaderboard() {
  const supabase = await createClient();

  const { data: topUsers } = await supabase
    .from("profiles")
    .select("id, full_name, reputation, avatar_url")
    .order("reputation", { ascending: false })
    .limit(5);

  return (
    <div className="bg-white dark:bg-slate-900 dark:border-slate-800 rounded-xl border border-slate-200 shadow-sm overflow-hidden h-fit">
      <div className="p-4 border-b border-yellow-100 dark:border-slate-800 bg-yellow-50 dark:bg-slate-900/50 flex items-center">
        <Trophy className="mr-2 h-5 w-5 text-yellow-600 dark:text-yellow-500" />
        <h3 className="font-bold text-yellow-800 dark:text-yellow-500">Bảng vàng vinh danh</h3>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {topUsers?.map((u, idx) => (
          <div key={u.id || idx} className={`p-3 flex items-center justify-between hover:bg-yellow-50/30 dark:hover:bg-slate-800/50 transition ${idx === 0 ? 'bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl m-1' : ''}`}>
            <div className="flex items-center gap-3">
              <span className={`font-bold w-6 text-center flex justify-center ${idx === 0 ? 'text-yellow-600 dark:text-yellow-500 text-lg' : 'text-gray-500 dark:text-slate-500'}`}>
                {idx === 0 ? '🥇' : `#${idx + 1}`}
              </span>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-slate-700 overflow-hidden">
                  {u.avatar_url ? (
                    <img src={u.avatar_url} className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-5 w-5 m-1.5 text-gray-400 dark:text-slate-400" />
                  )}
                </div>
                <p className="font-medium text-sm truncate max-w-[120px] dark:text-slate-200">{u.full_name}</p>
              </div>
            </div>
            <span className="font-bold text-sm text-yellow-700 dark:text-yellow-500">{u.reputation} pts</span>
          </div>
        ))}
        {(!topUsers || topUsers.length === 0) && (
          <p className="p-4 text-sm text-gray-500 dark:text-slate-400 text-center">Chưa có dữ liệu xếp hạng.</p>
        )}
      </div>
    </div>
  );
}

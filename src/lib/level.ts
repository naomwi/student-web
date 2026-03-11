export interface Tier {
  level: number;
  name: string;
  emoji: string;
  color: string;
  minPoints: number;
  maxPoints: number;
}

export const TIERS: Tier[] = [
  { level: 1, name: "Tân Sinh Viên", emoji: "🌱", color: "text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400", minPoints: 0, maxPoints: 49 },
  { level: 2, name: "Người Học", emoji: "📖", color: "text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400", minPoints: 50, maxPoints: 149 },
  { level: 3, name: "Người Khám Phá", emoji: "🔍", color: "text-teal-600 bg-teal-100 dark:bg-teal-900/30 dark:text-teal-400", minPoints: 150, maxPoints: 299 },
  { level: 4, name: "Người Viết", emoji: "✏️", color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400", minPoints: 300, maxPoints: 499 },
  { level: 5, name: "Tư Duy Viên", emoji: "💡", color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400", minPoints: 500, maxPoints: 799 },
  { level: 6, name: "Học Giả", emoji: "🎓", color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400", minPoints: 800, maxPoints: 1199 },
  { level: 7, name: "Người Dẫn Đầu", emoji: "🏆", color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400", minPoints: 1200, maxPoints: 1799 },
  { level: 8, name: "Chuyên Gia", emoji: "🌟", color: "text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400", minPoints: 1800, maxPoints: 2499 },
  { level: 9, name: "Cố Vấn Tinh Anh", emoji: "🔥", color: "text-rose-600 bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400", minPoints: 2500, maxPoints: 3499 },
  { level: 10, name: "Huyền Thoại", emoji: "👑", color: "text-yellow-700 bg-gradient-to-r from-yellow-200 to-amber-300 dark:from-yellow-900/50 dark:to-amber-900/50 dark:text-yellow-400 border border-yellow-400/50", minPoints: 3500, maxPoints: Infinity },
];

export function getTierFromPoints(points: number = 0): Tier {
  // Guard against negative points just in case
  const safePoints = Math.max(0, points);
  
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (safePoints >= TIERS[i].minPoints) {
      return TIERS[i];
    }
  }
  
  return TIERS[0];
}

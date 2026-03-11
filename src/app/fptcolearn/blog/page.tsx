import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { PlusCircle, Calendar, Hash, Clock, BookOpen } from "lucide-react";
import { FAB } from "@/components/shared/fab";
import { EmptyState } from "@/components/shared/empty-state";

export default async function BlogListPage({ searchParams }: { searchParams: Promise<{ tag?: string }> }) {
  const params = await searchParams;
  const tagFilter = params.tag;

  const supabase = await createClient();

  let query = supabase
    .from("posts")
    .select("*, profiles(full_name, avatar_url)")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (tagFilter) {
    query = query.contains("tags", [tagFilter]);
  }

  const { data: posts } = await query;

  const allTags = ["Tips", "ExamPrep", "Internship", "Life", "Tech"];

  return (
    <div className="flex flex-col lg:flex-row gap-8 relative pb-24 font-body">
      <div className="flex-1 min-w-0 space-y-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight font-display text-[#1a2332] dark:text-white">
            {tagFilter ? `Bài viết: #${tagFilter}` : "Học thuật & Blog"}
          </h2>
        </div>

        <div className="grid gap-6">
          {posts?.map((post) => {
            // Calculate fake read time based on content length
            const readTime = Math.max(1, Math.ceil(post.content.length / 500));
            
            return (
            <div key={post.id} className="group relative flex flex-col space-y-4 rounded-xl border-t-2 border-t-[#2DD4BF] border-x border-b border-slate-200 dark:border-x-slate-800 dark:border-b-slate-800 p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition bg-white dark:bg-[#1a2332] shadow-sm hover:shadow-md">
              <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#0D9488] dark:text-[#2DD4BF]">{(post.profiles as any)?.full_name || "Ẩn danh"}</span>
                  <span>•</span>
                  <span className="flex items-center">
                    <Calendar className="mr-1 h-3.5 w-3.5" />
                    {new Date(post.created_at).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md text-xs">
                  <Clock className="h-3 w-3" />
                  {readTime} phút đọc
                </div>
              </div>

              <Link href={`/fptcolearn/blog/${post.slug}`} className="block">
                <h3 className="font-bold text-2xl leading-snug font-display group-hover:text-[#0D9488] dark:group-hover:text-[#2DD4BF] transition-colors">
                  {post.title}
                </h3>
              </Link>

              {post.tags && (
                <div className="flex gap-2">
                  {post.tags.map((tag: string) => (
                    <span key={tag} className="text-xs font-medium bg-[#0D9488]/10 text-[#0D9488] dark:bg-[#2DD4BF]/10 dark:text-[#2DD4BF] px-2.5 py-1 rounded-md">#{tag}</span>
                  ))}
                </div>
              )}

              <div
                className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content.replace(/<[^>]+>/g, '').substring(0, 200) + "..." }}
              />
            </div>
          )})}

          {posts?.length === 0 && (
            <EmptyState icon={<BookOpen className="h-12 w-12 text-slate-300" />} message="Không tìm thấy bài viết nào." />
          )}
        </div>
      </div>

      <div className="hidden lg:block w-[300px] flex-shrink-0">
        <div className="bg-white dark:bg-[#1a2332] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm sticky top-8">
          <h3 className="font-semibold mb-4 flex items-center font-display text-lg text-[#1a2332] dark:text-slate-200">
            <Hash className="mr-2 h-5 w-5 text-[#0D9488]" /> Chủ đề phổ biến
          </h3>
          <div className="flex flex-wrap gap-2">
            <Link href="/fptcolearn/blog" className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${!tagFilter ? 'bg-[#0D9488] text-white border-[#0D9488]' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 dark:border-slate-700'}`}>
              Tất cả
            </Link>
            {allTags.map(tag => (
              <Link
                key={tag}
                href={`/fptcolearn/blog?tag=${tag}`}
                className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${tagFilter === tag ? 'bg-[#0D9488] text-white border-[#0D9488]' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 dark:border-slate-700'}`}
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <FAB href="/fptcolearn/blog/new" icon={<PlusCircle className="h-6 w-6" />} label="Viết bài mới" />
    </div>
  );
}

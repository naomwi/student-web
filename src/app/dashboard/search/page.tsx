import { createClient } from "@/lib/supabase/server";
import { SectionHeader } from "@/components/shared/section-header";
import { EmptyState } from "@/components/shared/empty-state";
import { SearchX, FileText, BookOpen, MessageCircleQuestion } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Tìm kiếm | FPTcolearn",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const { q } = await searchParams;
  const query = q || "";

  if (!query) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Kết quả tìm kiếm</h2>
        <EmptyState 
          icon={<SearchX className="h-12 w-12 text-slate-300" />} 
          message="Vui lòng nhập từ khóa để tìm kiếm." 
        />
      </div>
    );
  }

  const supabase = await createClient();
  const searchTerm = `%${query}%`;

  const [
    { data: docs },
    { data: posts },
    { data: qa },
  ] = await Promise.all([
    supabase.from("documents").select("id, title, category").ilike("title", searchTerm).limit(10),
    supabase.from("posts").select("id, slug, title, excerpt").ilike("title", searchTerm).limit(10),
    supabase.from("questions").select("id, title, content").ilike("title", searchTerm).limit(10),
  ]);

  const hasResults = (docs?.length || 0) > 0 || (posts?.length || 0) > 0 || (qa?.length || 0) > 0;

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-2">
          Kết quả tìm kiếm cho "{query}"
        </h2>
        <p className="text-slate-500 font-body">Tìm thấy kết quả trên các nền tảng của FPTcolearn.</p>
      </div>

      {!hasResults ? (
         <EmptyState 
           icon={<SearchX className="h-12 w-12 text-slate-300" />} 
           message={`Không tìm thấy kết quả nào phù hợp với "${query}".`} 
         />
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Documents */}
          <div className="space-y-4">
            <SectionHeader title="Tài liệu" icon={<FileText className="w-5 h-5 text-rose-500" />} />
            {docs && docs.length > 0 ? (
              <div className="flex flex-col gap-3">
                {docs.map(doc => (
                  <Link key={doc.id} href={`/dashboard/documents?q=${encodeURIComponent(doc.title)}`} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-rose-300 dark:hover:border-rose-700/50 transition shadow-sm group">
                     <h4 className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-rose-600 dark:group-hover:text-rose-400 mb-1">{doc.title}</h4>
                     {doc.category && <span className="text-xs px-2 py-1 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-md font-medium">{doc.category}</span>}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">Không tìm thấy tài liệu.</p>
            )}
          </div>

          {/* Posts */}
          <div className="space-y-4">
            <SectionHeader title="Bài viết" icon={<BookOpen className="w-5 h-5 text-blue-500" />} />
            {posts && posts.length > 0 ? (
              <div className="flex flex-col gap-3">
                {posts.map(post => (
                  <Link key={post.id} href={`/dashboard/blog/${post.slug}`} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-blue-300 dark:hover:border-blue-700/50 transition shadow-sm group">
                     <h4 className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-1">{post.title}</h4>
                     <p className="text-sm text-slate-500 line-clamp-2">{post.excerpt}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">Không tìm thấy bài viết.</p>
            )}
          </div>

          {/* Q&A */}
          <div className="space-y-4">
            <SectionHeader title="Hỏi đáp" icon={<MessageCircleQuestion className="w-5 h-5 text-emerald-500" />} />
            {qa && qa.length > 0 ? (
              <div className="flex flex-col gap-3">
                {qa.map(q => (
                  <Link key={q.id} href={`/dashboard/qa/${q.id}`} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-emerald-300 dark:hover:border-emerald-700/50 transition shadow-sm group">
                     <h4 className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 mb-1">{q.title}</h4>
                     <p className="text-sm text-slate-500 line-clamp-2">{q.content?.replace(/<[^>]*>?/gm, '')}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">Không tìm thấy câu hỏi.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle, Calendar, Hash } from "lucide-react";

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

  // Lấy danh sách tất cả Tags để làm sidebar filter (Demo đơn giản)
  // Trong thực tế nên có bảng Tags riêng hoặc query distinct tags
  const allTags = ["Tips", "ExamPrep", "Internship", "Life", "Tech"]; 

  return (
    <div className="flex flex-col lg:flex-row gap-8 relative">
      {/* Main Feed (Chiếm phần còn lại) */}
      <div className="flex-1 min-w-0 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight">
            {tagFilter ? `Bài viết: #${tagFilter}` : "Bài viết cộng đồng"}
          </h2>
          <Link href="/dashboard/blog/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Viết bài mới
            </Button>
          </Link>
        </div>

        <div className="grid gap-6">
          {posts?.map((post) => (
            <div key={post.id} className="group relative flex flex-col space-y-3 rounded-lg border p-6 hover:bg-slate-50 transition bg-white shadow-sm">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-semibold text-blue-600">{(post.profiles as any)?.full_name || "Ẩn danh"}</span>
                <span>•</span>
                <span className="flex items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  {new Date(post.created_at).toLocaleDateString('vi-VN')}
                </span>
              </div>
              
              <Link href={`/dashboard/blog/${post.slug}`} className="block">
                <h3 className="font-bold text-xl leading-snug group-hover:text-blue-700">
                  {post.title}
                </h3>
              </Link>

              {post.tags && (
                <div className="flex gap-2">
                  {post.tags.map((tag: string) => (
                    <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">#{tag}</span>
                  ))}
                </div>
              )}

              <div 
                className="text-gray-500 text-sm line-clamp-2"
                dangerouslySetInnerHTML={{ __html: post.content.replace(/<[^>]+>/g, '').substring(0, 200) + "..." }} 
              />
            </div>
          ))}

          {posts?.length === 0 && (
            <div className="text-center py-10 text-gray-500 border rounded-lg bg-gray-50">
              Không tìm thấy bài viết nào.
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Filter (Width cố định 300px) */}
      <div className="hidden lg:block w-[300px] flex-shrink-0">
        <div className="bg-white p-5 rounded-lg border shadow-sm sticky top-8">
          <h3 className="font-semibold mb-4 flex items-center text-slate-800">
            <Hash className="mr-2 h-4 w-4 text-blue-600" /> Chủ đề phổ biến
          </h3>
          <div className="flex flex-wrap gap-2">
            <Link href="/dashboard/blog" className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${!tagFilter ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-gray-100 text-gray-600'}`}>
              Tất cả
            </Link>
            {allTags.map(tag => (
              <Link 
                key={tag} 
                href={`/dashboard/blog?tag=${tag}`}
                className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${tagFilter === tag ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-gray-100 text-gray-600'}`}
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
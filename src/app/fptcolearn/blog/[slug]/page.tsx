import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { CommentSection } from "@/components/blog/comment-section";
import { DeletePostButton } from "@/components/blog/delete-post-button";
import { Calendar, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase.from("posts").select("title, excerpt").eq("slug", slug).single();

  if (!post) return { title: "Bài viết không tồn tại" };

  return {
    title: post.title,
    description: post.excerpt || `Đọc bài viết ${post.title} trên FPTcolearn`,
    openGraph: {
      title: post.title,
      description: post.excerpt || "Chia sẻ kiến thức cùng cộng đồng sinh viên FPTcolearn",
      type: 'article',
    },
  }
}

// Dùng params dưới dạng Promise (Next.js 15+ convention)
export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch Post + Author + Comments
  const { data: post } = await supabase
    .from("posts")
    .select(`
      *,
      profiles(full_name, avatar_url),
      comments(
        id, content, created_at,
        profiles(full_name, avatar_url)
      )
    `)
    .eq("slug", slug) // Giả sử dùng slug, nếu dùng ID thì đổi query
    .single();

  if (!post) notFound();

  // Sắp xếp comment mới nhất
  const comments = post.comments?.sort((a: any, b: any) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  ) || [];

  const { data: { user } } = await supabase.auth.getUser();
  // Get user profile to check username
  let isAuthorOrAdmin = false;
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('username').eq('id', user.id).single();
    isAuthorOrAdmin = user.id === post.author_id || profile?.username === 'nao';
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link href="/fptcolearn/blog" className="inline-flex items-center text-sm text-slate-500 hover:text-indigo-600 transition font-medium">
          <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-3xl font-extrabold mb-4 break-words text-slate-900 dark:text-slate-100">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span className="font-medium text-blue-600">{post.profiles?.full_name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-2 mt-4">
              {post.tags.map((tag: string) => (
                <span key={tag} className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
        {isAuthorOrAdmin && (
          <div className="shrink-0 mt-2 sm:mt-0">
            <DeletePostButton postId={post.id} />
          </div>
        )}
      </div>

      {/* Content */}
      <div
        className="prose prose-lg dark:prose-invert max-w-none mb-12 break-words text-wrap overflow-hidden [&_p]:break-words [&_a]:break-all"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <hr className="my-8 border-gray-200 dark:border-slate-800" />

      {/* Comments */}
      <CommentSection postId={post.id} comments={comments} />
    </div>
  );
}

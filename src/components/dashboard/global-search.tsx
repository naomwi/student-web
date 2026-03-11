"use client";

import { useState, useEffect } from "react";
import { Search, BookOpen, FileText, Users, MapPin, MessageCircleQuestion, ArrowRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ docs: any[], posts: any[], qa: any[] }>({ docs: [], posts: [], qa: [] });
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim() || query.length < 2) {
        setResults({ docs: [], posts: [], qa: [] });
        return;
      }

      setLoading(true);
      const searchTerm = `%${query}%`;

      const [docsRes, postsRes, qaRes] = await Promise.all([
        supabase.from("documents").select("id, title").ilike("title", searchTerm).limit(3),
        supabase.from("posts").select("id, slug, title").ilike("title", searchTerm).limit(3),
        supabase.from("questions").select("id, title").ilike("title", searchTerm).limit(3),
      ]);

      setResults({
        docs: docsRes.data || [],
        posts: postsRes.data || [],
        qa: qaRes.data || [],
      });
      setLoading(false);
    };

    const timer = setTimeout(fetchResults, 300);
    return () => clearTimeout(timer);
  }, [query, supabase]);

  if (!open) {
    return (
      <button 
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 mb-6 bg-slate-100/5 hover:bg-slate-100/10 text-slate-400 hover:text-white border border-slate-700/50"
      >
        <Search className="h-4 w-4" />
        <span className="font-medium text-sm flex-1 text-left">Tìm kiếm...</span>
        <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-slate-700 bg-slate-800 px-1.5 font-mono text-[10px] font-medium text-slate-400 opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
    );
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setOpen(false);
    router.push(`/dashboard/search?q=${encodeURIComponent(query)}`);
  };

  const hasResults = results.docs.length > 0 || results.posts.length > 0 || results.qa.length > 0;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-in fade-in" onClick={() => setOpen(false)} />
      <div className="fixed left-[50%] top-[20%] z-[101] w-full max-w-2xl translate-x-[-50%] p-4 animate-in fade-in zoom-in-95">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
          <form onSubmit={handleSearch} className="flex items-center px-4 py-4 border-b border-slate-100 dark:border-slate-800">
            <Search className="h-5 w-5 text-slate-400 mr-3" />
            <Input 
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nhập từ khóa tìm kiếm tài liệu, câu hỏi, bài viết..." 
              className="border-none bg-transparent shadow-none focus-visible:ring-0 px-0 text-lg h-auto"
            />
            <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-2 font-mono text-xs font-medium text-slate-500">
              ESC
            </kbd>
          </form>

          <div className="p-2 max-h-[60vh] overflow-y-auto">
            {loading && query.length >= 2 ? (
              <div className="flex items-center justify-center p-8 text-slate-500">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : query.length >= 2 && !hasResults ? (
              <div className="p-8 text-center text-slate-500">
                Không tìm thấy kết quả nào cho "{query}"
              </div>
            ) : hasResults ? (
              <div className="space-y-4 p-2">
                {results.docs.length > 0 && (
                  <div>
                    <div className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                      <FileText className="h-3 w-3" /> Tài liệu
                    </div>
                    {results.docs.map(doc => (
                      <Link key={doc.id} href={`/dashboard/documents?q=${encodeURIComponent(doc.title)}`} onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition">
                        <span className="truncate">{doc.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
                {results.posts.length > 0 && (
                  <div>
                    <div className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                      <BookOpen className="h-3 w-3" /> Bài viết
                    </div>
                    {results.posts.map(post => (
                      <Link key={post.id} href={`/dashboard/blog/${post.slug}`} onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition">
                        <span className="truncate">{post.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
                {results.qa.length > 0 && (
                  <div>
                    <div className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                      <MessageCircleQuestion className="h-3 w-3" /> Hỏi đáp
                    </div>
                    {results.qa.map(q => (
                      <Link key={q.id} href={`/dashboard/qa/${q.id}`} onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition">
                        <span className="truncate">{q.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button onClick={handleSearch} className="w-full flex items-center justify-center gap-2 px-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-[#0D9488] dark:text-[#2DD4BF] font-semibold transition">
                    Xem tất cả kết quả cho "{query}" <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Phím tắt nhanh</div>
                <Link href="/dashboard/documents" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition">
                  <FileText className="h-4 w-4 text-rose-500" /> <span>Tìm tài liệu học tập</span>
                </Link>
                <Link href="/dashboard/qa" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition">
                  <MessageCircleQuestion className="h-4 w-4 text-emerald-500" /> <span>Hỏi đáp cộng đồng</span>
                </Link>
                <Link href="/dashboard/blog" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition">
                  <BookOpen className="h-4 w-4 text-blue-500" /> <span>Xem bài viết học thuật</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

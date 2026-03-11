import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/settings/profile-form";
import { ChangePasswordForm } from "@/components/settings/change-password-form";
import { FileText, Book, User } from "lucide-react";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch Profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch Activity (Posts)
  const { data: myPosts } = await supabase
    .from("posts")
    .select("id, title, created_at, is_published")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  // Fetch Activity (Docs)
  const { data: myDocs } = await supabase
    .from("documents")
    .select("id, file_name, created_at")
    .eq("uploader_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-foreground">Cài đặt tài khoản</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Update Form */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-card p-6 rounded-lg border border-border shadow-sm h-fit">
            <h2 className="text-xl font-semibold mb-4 flex items-center text-foreground">
              <User className="mr-2 h-5 w-5 text-primary" /> Thông tin cá nhân
            </h2>
            
            <ProfileForm profile={profile} />
          </div>

          <ChangePasswordForm />
        </div>

        {/* RIGHT COLUMN: Activity History */}
        <div className="space-y-6">
          {/* Posts History */}
          <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
            <h3 className="font-semibold mb-3 flex items-center text-foreground">
              <Book className="mr-2 h-4 w-4 text-blue-600" /> Bài viết gần đây
            </h3>
            <div className="space-y-3">
              {myPosts?.length === 0 ? (
                <p className="text-sm text-muted-foreground">Chưa có bài viết nào.</p>
              ) : (
                myPosts?.map((post) => (
                  <div key={post.id} className="border-b border-border pb-2 last:border-0 last:pb-0">
                    <p className="font-medium text-sm truncate text-foreground">{post.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(post.created_at).toLocaleDateString()} • {post.is_published ? "Đã đăng" : "Nháp"}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Docs History */}
          <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
            <h3 className="font-semibold mb-3 flex items-center text-foreground">
              <FileText className="mr-2 h-4 w-4 text-green-600" /> Tài liệu đã tải lên
            </h3>
            <div className="space-y-3">
              {myDocs?.length === 0 ? (
                <p className="text-sm text-muted-foreground">Chưa upload tài liệu nào.</p>
              ) : (
                myDocs?.map((doc) => (
                  <div key={doc.id} className="border-b border-border pb-2 last:border-0 last:pb-0">
                    <p className="font-medium text-sm truncate text-foreground">{doc.file_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(doc.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
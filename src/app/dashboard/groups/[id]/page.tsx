import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Users, MapPin, ExternalLink, ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { id } = await params;
    const supabase = await createClient();

    const { data: group } = await supabase
        .from("study_groups")
        .select("name, description")
        .eq("id", id)
        .single();

    if (!group) return { title: "Nhóm không tồn tại" };

    return {
        title: `${group.name} - UniConnect`,
        description: group.description || `Nhóm học tập ${group.name} trên UniConnect`,
    };
}

export default async function GroupDetailPage({ params }: Props) {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: group } = await supabase
        .from("study_groups")
        .select(`
      *,
      study_group_members(
        user_id,
        profiles(full_name, avatar_url)
      )
    `)
        .eq("id", id)
        .single();

    if (!group) notFound();

    const members = group.study_group_members || [];
    const isMember = members.some((m: any) => m.user_id === user?.id);

    return (
        <div className="max-w-3xl mx-auto py-8">
            {/* Back */}
            <div className="mb-6">
                <Link
                    href="/dashboard/groups"
                    className="inline-flex items-center text-sm text-slate-500 hover:text-indigo-600 transition font-medium"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách nhóm
                </Link>
            </div>

            {/* Header */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 mb-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mb-1">
                            {group.name}
                        </h1>
                        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1">
                                <Users className="h-4 w-4" /> {members.length} thành viên
                            </span>
                            {group.location && (
                                <span className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" /> {group.location}
                                </span>
                            )}
                            {group.created_at && (
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" /> {new Date(group.created_at).toLocaleDateString("vi-VN")}
                                </span>
                            )}
                        </div>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${isMember
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                        }`}>
                        {isMember ? "Đã tham gia" : "Chưa tham gia"}
                    </span>
                </div>

                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {group.description || "Nhóm học tập này chưa có mô tả."}
                </p>

                {isMember && group.meeting_link && (
                    <a
                        href={group.meeting_link}
                        target="_blank"
                        className="inline-flex items-center gap-2 mt-4 text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                    >
                        <ExternalLink className="h-4 w-4" /> Vào phòng họp
                    </a>
                )}
            </div>

            {/* Members */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                <h2 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-indigo-500" /> Danh sách thành viên
                </h2>

                {members.length === 0 ? (
                    <p className="text-sm text-slate-500 italic">Chưa có thành viên nào.</p>
                ) : (
                    <div className="grid gap-3">
                        {members.map((member: any, i: number) => {
                            const profile = Array.isArray(member.profiles) ? member.profiles[0] : member.profiles;
                            return (
                                <div
                                    key={member.user_id || i}
                                    className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                >
                                    <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                                        {profile?.full_name?.[0]?.toUpperCase() || "?"}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                                            {profile?.full_name || "Người dùng"}
                                        </p>
                                        {member.user_id === user?.id && (
                                            <span className="text-[10px] text-indigo-500 font-medium uppercase">Bạn</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

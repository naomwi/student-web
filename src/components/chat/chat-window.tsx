"use client";

import { useEffect, useState, useTransition } from "react";
import { getChannels, searchUsers, createDM } from "@/actions/chat-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Hash, Users, MessageSquare, ChevronLeft, Send, Search, UserPlus, Loader2, Sparkles } from "lucide-react";
import { MessageList } from "./message-list";
import { AITutorChat } from "./ai-tutor-chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Channel {
  id: string;
  name: string;
  type: "global" | "group" | "dm" | "ai";
  avatar_url?: string;
}

interface UserResult {
  id: string;
  full_name: string;
  avatar_url: string;
  email: string;
}

export function ChatWindow({ userId, onClose }: { userId: string; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<"list" | "chat">("list");
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [channels, setChannels] = useState<{ global: Channel[], groups: Channel[], dms: Channel[] }>({ global: [], groups: [], dms: [] });
  const [loading, setLoading] = useState(true);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserResult[]>([]);
  const [isSearching, startSearch] = useTransition();
  const [isCreatingDM, startCreateDM] = useTransition();

  async function loadChannels() {
    const data = await getChannels(userId);
    setChannels(data);
    setLoading(false);
  }

  useEffect(() => {
    loadChannels();

    const handleOpenChat = (e: Event) => {
      const customEvent = e as CustomEvent;
      const targetId = customEvent.detail?.channelId;
      if (targetId) {
        // Lấy danh sách channel mới nhất rồi mở tab chat
        loadChannels().then(() => {
          // Effect checkPendingChannel bên dưới sẽ tự bắt dms có targetId
        });

        // Thử chọn ngay nếu đã có sẵn trong state
        const found = channels.dms.find(c => c.id === targetId);
        if (found) {
          handleSelectChannel(found);
        } else {
          // Đánh dấu cần mở
          sessionStorage.setItem("pending_open_channel", targetId);
        }
      }
    };

    window.addEventListener("open-chat", handleOpenChat);
    return () => window.removeEventListener("open-chat", handleOpenChat);
  }, [userId]);

  useEffect(() => {
    const pendingId = sessionStorage.getItem("pending_open_channel");
    if (pendingId) {
      const found = channels.dms.find(c => c.id === pendingId);
      if (found) {
        handleSelectChannel(found);
        sessionStorage.removeItem("pending_open_channel");
      }
    }
  }, [channels]);

  const handleSelectChannel = (channel: Channel) => {
    setSelectedChannel(channel);
    setActiveTab("chat");
  };

  const handleBack = () => {
    setActiveTab("list");
    setSelectedChannel(null);
    loadChannels(); // Refresh to update last message or order if needed
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 1) {
      startSearch(async () => {
        const results = await searchUsers(query);
        setSearchResults(results as any);
      });
    } else {
      setSearchResults([]);
    }
  };

  const handleStartDM = (targetUser: UserResult) => {
    startCreateDM(async () => {
      const result = await createDM(targetUser.id);
      if (result.id) {
        setSearchQuery("");
        setSearchResults([]);
        // Optimistically add or select channel
        const newChannel: Channel = {
          id: result.id,
          name: targetUser.full_name,
          type: "dm",
          avatar_url: targetUser.avatar_url
        };
        handleSelectChannel(newChannel);
        loadChannels(); // Refresh list in background
      }
    });
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900">
      {/* HEADER */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 z-10">
        {activeTab === "chat" && (
          <Button variant="ghost" size="icon" onClick={handleBack} className="-ml-2 mr-2">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 flex-1 truncate flex items-center gap-2">
          {activeTab === "list" ? "Tin nhắn" : (
            <>
              {selectedChannel?.type === 'dm' && (
                <Avatar className="h-6 w-6">
                  <AvatarImage src={selectedChannel?.avatar_url} />
                  <AvatarFallback>{selectedChannel?.name[0]}</AvatarFallback>
                </Avatar>
              )}
              {selectedChannel?.type === 'ai' && (
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Sparkles className="h-3 w-3 text-white" />
                </div>
              )}
              {selectedChannel?.name || "Chat"}
            </>
          )}
        </h3>
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-hidden relative">
        {activeTab === "list" ? (
          <div className="h-full overflow-y-auto p-2 space-y-6">

            {/* AI Tutor */}
            <div className="space-y-1">
              <h4 className="px-2 text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-indigo-500" /> Trợ lý thông minh
              </h4>
              <button onClick={() => handleSelectChannel({ id: "ai_tutor", name: "Gia sư AI", type: "ai" })} className="w-full flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-950/30 dark:hover:to-purple-950/30 transition text-left group border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/50">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 shadow-md flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-800 dark:text-slate-200">Gia sư AI</p>
                  <p className="text-xs text-indigo-500 dark:text-indigo-400 truncate max-w-[200px] font-medium">Hỏi bài tập, giải đáp kiến thức...</p>
                </div>
              </button>
            </div>

            {/* Global Channels */}
            <div className="space-y-1">
              <h4 className="px-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Chung</h4>
              {channels.global.map(c => (
                <ChannelItem key={c.id} channel={c} icon={<Hash className="h-4 w-4" />} onClick={() => handleSelectChannel(c)} />
              ))}
            </div>

            {/* Group Channels */}
            <div className="space-y-1">
              <h4 className="px-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nhóm học tập</h4>
              {channels.groups.length === 0 ? (
                <p className="px-2 text-sm text-slate-500 italic">Chưa tham gia nhóm nào.</p>
              ) : (
                channels.groups.map(c => (
                  <ChannelItem key={c.id} channel={c} icon={<Users className="h-4 w-4" />} onClick={() => handleSelectChannel(c)} />
                ))
              )}
            </div>

            {/* DM Channels */}
            <div className="space-y-1">
              <div className="flex justify-between items-center px-2 mb-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tin nhắn riêng</h4>
              </div>

              {/* User Search */}
              <div className="px-2 mb-3 relative">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Tìm bạn bè..."
                    className="pl-9 h-9 text-sm bg-slate-50 dark:bg-slate-800 border-none"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                  {isSearching && <Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 animate-spin text-indigo-500" />}
                </div>

                {/* Search Results Dropdown */}
                {searchQuery.length > 1 && (
                  <div className="absolute top-10 left-2 right-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg shadow-xl z-20 max-h-[200px] overflow-y-auto">
                    {searchResults.length === 0 && !isSearching ? (
                      <p className="p-3 text-sm text-slate-500 text-center">Không tìm thấy người dùng.</p>
                    ) : (
                      searchResults.map(user => (
                        <button
                          key={user.id}
                          className="w-full flex items-center gap-3 p-3 hover:bg-indigo-50 dark:hover:bg-slate-700 transition text-left"
                          onClick={() => handleStartDM(user)}
                          disabled={isCreatingDM}
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar_url} />
                            <AvatarFallback>{user.full_name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm text-slate-800 dark:text-slate-200">{user.full_name}</p>
                            <p className="text-xs text-slate-400 truncate">{user.email}</p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {channels.dms.length === 0 ? (
                <p className="px-2 text-sm text-slate-500 italic">Chưa có tin nhắn nào.</p>
              ) : (
                channels.dms.map(c => (
                  <ChannelItem
                    key={c.id}
                    channel={c}
                    icon={
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={c.avatar_url} />
                        <AvatarFallback>{c.name[0]}</AvatarFallback>
                      </Avatar>
                    }
                    onClick={() => handleSelectChannel(c)}
                  />
                ))
              )}
            </div>
          </div>
        ) : (
          selectedChannel?.type === 'ai' ? (
            <AITutorChat />
          ) : (
            selectedChannel && <MessageList channel={selectedChannel} userId={userId} />
          )
        )}
      </div>
    </div>
  );
}

function ChannelItem({ channel, icon, onClick }: { channel: Channel, icon: any, onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left group">
      <div className="h-10 w-10 rounded-full bg-indigo-50 dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{channel.name}</p>
        <p className="text-xs text-slate-500 truncate max-w-[200px]">Chạm để xem tin nhắn...</p>
      </div>
    </button>
  );
}

"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/actions/auth-actions";
import Link from "next/link";
import { User, Settings, LogOut, Sparkles } from "lucide-react";

interface UserNavProps {
  user: {
    email: string;
    full_name?: string;
    avatar_url?: string;
    username?: string;
  };
}

export function UserNav({ user }: UserNavProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-12 w-12 rounded-full ring-2 ring-white ring-offset-2 ring-offset-indigo-50 hover:scale-105 transition-all duration-300">
          <Avatar className="h-12 w-12 border-2 border-white shadow-lg">
            <AvatarImage src={user.avatar_url} alt={user.full_name || ""} className="object-cover" />
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-lg">
              {user.email?.[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-64 z-[60] bg-white/95 backdrop-blur-xl border border-slate-100 shadow-2xl rounded-2xl p-2 mt-2" align="end" forceMount>
        <DropdownMenuLabel className="font-normal p-3 bg-slate-50 rounded-xl mb-2">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-bold text-indigo-900 leading-none flex items-center gap-2">
              {user.full_name || "Sinh viên"}
              <Sparkles className="h-3 w-3 text-amber-500" />
            </p>
            <p className="text-xs leading-none text-slate-500 font-medium">
              {user.username ? `@${user.username}` : user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="rounded-lg focus:bg-indigo-50 focus:text-indigo-700 cursor-pointer py-2.5">
            <Link href="/dashboard/settings">
              <User className="mr-2 h-4 w-4 text-slate-400 group-hover:text-indigo-600" />
              <span className="font-medium">Hồ sơ cá nhân</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="rounded-lg focus:bg-indigo-50 focus:text-indigo-700 cursor-pointer py-2.5">
            <Link href="/dashboard/settings">
              <Settings className="mr-2 h-4 w-4 text-slate-400 group-hover:text-indigo-600" />
              <span className="font-medium">Cài đặt</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator className="bg-slate-100 my-2" />
        
        <DropdownMenuItem 
          className="rounded-lg text-rose-600 focus:bg-rose-50 focus:text-rose-700 cursor-pointer py-2.5"
          onClick={async () => await signOutAction()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span className="font-medium">Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
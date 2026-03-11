"use client";

import React, { createContext, useContext } from "react";
import { Tier, getTierFromPoints } from "@/lib/level";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  username: string;
  avatar_url: string | null;
  reputation: number; // The database column is named 'reputation', we treat it as 'points'
}

interface UserContextValue {
  user: UserProfile;
  tier: Tier;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ 
  user, 
  children 
}: { 
  user: UserProfile; 
  children: React.ReactNode;
}) {
  const tier = getTierFromPoints(user.reputation || 0);

  return (
    <UserContext.Provider value={{ user, tier }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

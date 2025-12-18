import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User as AuthUser } from "@/features/auth/types/auth.types";
import type { User as UserProfile } from "@/features/users/types/user.types";

interface AuthState {
  token: string | null;
  user: AuthUser | UserProfile | null;
  setAuth: (token: string, user: AuthUser | UserProfile) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
  hasPermission: (permission: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      setAuth: (token: string, user: AuthUser | UserProfile) =>
        set({ token, user }),
      clearAuth: () => set({ token: null, user: null }),
      isAuthenticated: () => !!get().token,
      hasPermission: (permission: string) => {
        const user = get().user as any;
        if (!user) return false;
        if (Array.isArray(user.roles)) return user.roles.includes(permission);
        if (Array.isArray(user.permissions))
          return user.permissions.includes(permission);
        return false;
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

import { Session } from "next-auth";
import { create } from "zustand";

interface UserSessionData {
    session: Session | null;
    setSession: (session: Session | null) => void;
}

export const useUserSessionStore = create<UserSessionData>((set) => ({
    session: null,
    setSession: (session) => set({ session })
}))
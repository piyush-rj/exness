'use client'

import { useUserSessionStore } from "@/src/store/useUserSessionStore";
import { signIn } from "next-auth/react";

export default function Home() {

  async function handleSignin() {
    await signIn('google', {
      redirect: false,
      callbackUrl: '/',
    });
  }

  const { session }  = useUserSessionStore();

  return (
    <div className="bg-neutral-950 h-screen w-screen flex justify-center items-center">
      <button
        onClick={handleSignin}
        className="text-xl border px-2.5 py-1 rounded-sm hover:bg-neutral-800 transition-colors cursor-pointer"
        >
        {session ? `${session.user.name}` : 'sign in'}
      </button>
    </div>
  );
}
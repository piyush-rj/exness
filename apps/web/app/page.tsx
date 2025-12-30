'use client'

import { useUserSessionStore } from "@/src/store/useUserSessionStore";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  async function handleSignin() {
    await signIn('google', {
      redirect: false,
      callbackUrl: '/',
    });
  }

  const { session }  = useUserSessionStore();

  return (
    <div className="bg-neutral-950 h-screen w-screen flex flex-col justify-center items-center gap-3">
      <button
        onClick={handleSignin}
        className="text-xl border px-2.5 py-1 rounded-sm hover:bg-neutral-800 transition-colors cursor-pointer"
        >
        {session ? `${session.user.name}` : 'sign in'}
      </button>
      <button
      className="bg-neutral-200 text-black px-3 py-1 rounded-sm cursor-pointer hover:bg-neutral-300"
        onClick={() => router.push('/dashboard')}
      >
        redirect
      </button>
    </div>
  );
}
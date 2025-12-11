'use client'

import { signIn } from "next-auth/react";

export default function Home() {

  async function handleSignin() {
    await signIn('google', {
      callbackUrl: '/' // Fixed: was 'callback'
    });
  }

  return (
    <div className="bg-neutral-900 h-screen w-screen flex justify-center items-center">
      <button
        onClick={handleSignin}
        className="text-xl border px-2 py-1 rounded-sm hover:bg-neutral-800 transition-colors cursor-pointer"
      >
        Sign in
      </button>
    </div>
  );
}
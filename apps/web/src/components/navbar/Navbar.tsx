'use client';

import { signIn } from 'next-auth/react';
import { useUserSessionStore } from '@/src/store/useUserSessionStore';

export default function Navbar() {
  const { session } = useUserSessionStore();

  async function handleSignIn() {
    await signIn('google', {
      redirect: false,
      callbackUrl: '/',
    });
  }

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-emerald-500 text-sm">◆</span>
          <span className="text-white font-medium tracking-tight text-sm">
            FAKENANCE
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-[11px] font-medium text-neutral-400 tracking-widest">
          {['Markets', 'Platform', 'Institutional', 'Company'].map((item) => (
            <a key={item} href="#" className="hover:text-white transition-colors">
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {session ? (
            <button
              type="button"
              className="rounded-xl border border-neutral-800 px-4 py-2 text-sm hover:bg-neutral-900 transition cursor-pointer"
            >
              Go to dashboard
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSignIn}
              className="rounded-xl border border-neutral-800 px-4 py-2 text-sm hover:bg-neutral-900 transition cursor-pointer"
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

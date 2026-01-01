'use client';

import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useUserSessionStore } from '@/src/store/useUserSessionStore';

export default function BaseNavbar() {
  const { session } = useUserSessionStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  async function handleSignIn() {
    await signIn('google', { redirect: false, callbackUrl: '/' });
  }

  return (
    <nav
      className={[
        'fixed top-0 left-0 right-0 z-50 transition-all',
        scrolled
          ? 'backdrop-blur-md shadow-[0_1px_0_rgba(255,255,255,0.04)]'
          : '',
      ].join(' ')}
    >
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
        <span className="text-lg font-semibold tracking-wide text-neutral-100">
          Fakenance
        </span>

        <div className="hidden md:flex gap-8 text-sm text-neutral-400">
          {['Markets', 'Platform', 'Pricing', 'About'].map((item) => (
            <a
              key={item}
              href="#"
              className="hover:text-neutral-200 transition"
            >
              {item}
            </a>
          ))}
        </div>

        {session ? (
          <button className="rounded-xl border border-neutral-800 px-4 py-2 text-sm hover:bg-neutral-900 transition">
            Dashboard
          </button>
        ) : (
          <button
            onClick={handleSignIn}
            className="rounded-xl border border-neutral-800 px-4 py-2 text-sm hover:bg-neutral-900 transition"
          >
            Sign in
          </button>
        )}
      </div>
    </nav>
  );
}

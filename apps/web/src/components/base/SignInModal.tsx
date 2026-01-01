'use client'
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation"

export default function SignInModal() {
    const router = useRouter();

    async function handleSignIn() {
        await signIn('google', {
            redirect: false,
            callbackUrl: '/',
        })
    }

    return (
        <div
            className=""
            onClick={handleSignIn}
        >
            Sign in
        </div>
    )
}
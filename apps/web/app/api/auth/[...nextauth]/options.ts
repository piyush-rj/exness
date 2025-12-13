import { SIGNIN_URL } from "../../../../../web/src/routes/api-routes";
import GoogleProvider from 'next-auth/providers/google';
import axios from "axios";
import { Account, AuthOptions, ISODateString } from "next-auth";
import { JWT } from "next-auth/jwt";

export interface UserType {
    id?: string | null;
    name?: string | null;
    image?: string | null;
    email?: string | null;
    provider?: string | null;
    token?: string | null;
}

export interface CustomSession {
    user?: UserType,
    expires: ISODateString;
}

export const authOptions: AuthOptions = {
    pages: { signIn: '/' },
    session: { strategy: 'jwt' },
    callbacks: {
        async signIn({ user, account }: { user: UserType, account: Account | null }) {
            try {
                if (account?.provider === 'google') {
                    const response = await axios.post(SIGNIN_URL, {
                        user,
                        account,
                    });

                    const result = response.data.data;
                    console.log('response succeded? ', response.data.success)

                    if (response.data?.success) {
                        user.id = result.id;
                        user.name = result.name;
                        user.email = result.email;
                        user.image = result.image;
                        user.provider = result.provider;

                        if (result.token) {
                            user.token = result.token;
                        }

                        return true;
                    }
                }
                return false;
            } catch (error) {
                console.error('failed to sign in', error);
                return false;
            }
        },
        async jwt({user, token}: { user: UserType, token: JWT }) {
            if (user) {
                token.user = user;
            }
            return token;
        },
        async session({ session, token }: { session: CustomSession, token: JWT }) {
            session.user = token.user as UserType;
            return session;
        }
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            authorization: {
                params: {
                    prompt: 'consent',
                    access_type: 'offline',
                    response_type: 'code',
                },
            },
        }),
    ]
}
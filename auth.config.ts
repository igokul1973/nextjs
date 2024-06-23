import type { NextAuthConfig } from 'next-auth';
import { TGetUserPayload } from './app/lib/data/user/types';

export type TSessionUser = Omit<TGetUserPayload, 'password'>;

export interface IGoogleUser extends Record<string, any> {
    id: string;
    email: string;
    name: string;
    image: string;
}

declare module 'next-auth' {
    interface Session {
        user: TSessionUser & IGoogleUser;
    }
}

declare module '@auth/core/jwt' {
    interface JWT {
        user: TSessionUser;
    }
}

export const authConfig = {
    pages: {
        signIn: '/login'
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            const isOnLoginPage = nextUrl.pathname.startsWith('/login');
            if (isOnDashboard) {
                return isLoggedIn ? true : Response.redirect(new URL('/', nextUrl.origin));
            } else if (isLoggedIn && isOnLoginPage) {
                return Response.redirect(new URL('/dashboard', nextUrl.origin));
            } else {
                return true;
            }
        },
        session({ session, token }) {
            return token.user ? { ...session, user: { ...session.user, ...token.user } } : session;
        },
        jwt({ token, user }) {
            if (user) {
                token.user = user as TSessionUser;
            }
            return token;
        }
    },
    secret: process.env.JWT_SECRET ?? 'anything',
    providers: []
} satisfies NextAuthConfig;

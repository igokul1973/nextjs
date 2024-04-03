import type { DefaultSession, NextAuthConfig } from 'next-auth';
import { TGetUserPayload } from './app/lib/data/users/types';

declare module 'next-auth' {
    interface Session {
        user: TGetUserPayload & DefaultSession['user'];
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
            if (isOnDashboard) {
                return isLoggedIn;
            } else if (isLoggedIn) {
                return Response.redirect(new URL('/dashboard', nextUrl));
            } else {
                return true;
            }
        },
        session({ session, token }) {
            if (token.user) {
                session.user.id = (token.user as TGetUserPayload).id;
                session.user.role = (token.user as TGetUserPayload).role;
                session.user.isActive = (token.user as TGetUserPayload).isActive;
                session.user.accountId = (token.user as TGetUserPayload).accountId;
                session.user.account = (token.user as TGetUserPayload).account;
            }
            return session;
        },
        jwt({ token, user }) {
            if (user) {
                token.user = user;
            }
            return token;
        }
    },
    providers: []
} satisfies NextAuthConfig;

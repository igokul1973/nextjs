import { TGetUserPayload } from '@/app/lib/data/users/types';
import { TEntities } from '@/app/lib/types';
import { getUserProvider, getUserProviderType } from '@/app/lib/utils';
import { EntitiesEnum } from '@prisma/client';
import type { DefaultSession, NextAuthConfig, User } from 'next-auth';
import type { AdapterUser } from 'next-auth/adapters';

declare module 'next-auth' {
    interface Session {
        user: TGetUserPayload & DefaultSession['user'];
        account: TGetUserPayload['account'];
        provider?: TEntities<
            TGetUserPayload['account']['individuals'][0],
            TGetUserPayload['account']['organizations'][0]
        >;
        providerType?: EntitiesEnum;
    }
}

declare module '@auth/core/jwt' {
    interface JWT {
        user: TGetUserPayload;
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
                return isLoggedIn;
            } else if (isLoggedIn && isOnLoginPage) {
                return Response.redirect(new URL('/dashboard', nextUrl.origin));
            } else {
                return true;
            }
        },
        session({ session, token }) {
            if (token.user) {
                session.user.id = token.user.id;
                session.user.role = token.user.role;
                session.user.isActive = token.user.isActive;
                session.user.accountId = token.user.accountId;
                session.user.account = token.user.account;
                session.account = token.user.account;
                // Get provider here and attach to the user
                session.provider = getUserProvider(token.user);
                session.providerType = getUserProviderType(session.provider);
            }
            return session;
        },
        jwt({ token, user }) {
            if (user) {
                token.user = user as TGetUserPayload;
            }
            return token;
        }
    },
    providers: []
} satisfies NextAuthConfig;

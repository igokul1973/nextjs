'use server';

import { getUserByEmail } from '@/app/lib/data/users';
import { compare } from 'bcryptjs';
import NextAuth, { NextAuthResult, Session } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { NextRequest } from 'next/server';
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next/types';
import { z } from 'zod';
import { authConfig } from './auth.config';

const {
    auth: serverAuth,
    signIn: serverSignIn,
    signOut: serverSignOut
}: NextAuthResult = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({
                        email: z.string().email(),
                        password: z.string().min(6)
                    })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUserByEmail(email);
                    if (!user) {
                        return null;
                    }
                    const passwordMatch = await compare(password, user.password);

                    if (passwordMatch) {
                        const { password: undefined, ...sanitizedUser } = user;
                        return sanitizedUser;
                    }
                }
                return null;
            }
        })
    ]
});

type NextAuthRequest = NextRequest & {
    auth: Session | null;
};

type AppRouteHandlerFnContext = {
    params?: Record<string, string | string[]>;
};

type AppRouteHandlerFn = (
    /**
     * Incoming request object.
     */
    req: NextRequest,
    /**
     * Context properties on the request (including the parameters if this was a
     * dynamic route).
     */
    ctx: AppRouteHandlerFnContext
) => void | Response | Promise<void | Response>;

type TAuth =
    | ((...args: [NextApiRequest, NextApiResponse]) => Promise<Session | null>)
    | ((...args: []) => Promise<Session | null>)
    | ((...args: [GetServerSidePropsContext]) => Promise<Session | null>)
    | ((...args: [(req: NextAuthRequest) => ReturnType<AppRouteHandlerFn>]) => AppRouteHandlerFn);

// @ts-expect-error(there is something wrong with the types in the next-auth package : NextAuthResult['auth'])
export const auth: NextAuthResult['auth'] = async (...args) => {
    // @ts-expect-error(Read above)
    return serverAuth(...args);
};

export const signIn: NextAuthResult['signIn'] = async (...args) => {
    return serverSignIn(...args);
};

export const signOut: NextAuthResult['signOut'] = async (...args) => {
    return serverSignOut(...args);
};

'use server';

import { getUserByEmail } from '@/app/lib/data/user';
import { compare } from 'bcryptjs';
import NextAuth, { NextAuthResult } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
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

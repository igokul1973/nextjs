import { getUserByEmail } from '@/app/lib/data/user';
import { compare } from 'bcryptjs';
import NextAuth, { NextAuthResult } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import Twitter from 'next-auth/providers/twitter';
import Facebook from 'next-auth/providers/facebook';
import { z } from 'zod';
import { authConfig } from './auth.config';

// We'll have Google, Twitter and Facebook auth providers.
export const { auth, signIn, signOut, handlers }: NextAuthResult = NextAuth({
    ...authConfig,
    providers: [
        Google,
        Twitter,
        Facebook,
        Credentials({
            async authorize(credentials) {
                // TODO: think about the password
                // authentication and whether I need it.
                // The password should also be more complex.
                const parsedCredentials = z
                    .object({
                        email: z.string().email(),
                        password: z.string().min(8)
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
                        const { password, ...userWithoutPassword } = user;

                        return userWithoutPassword;
                    }
                }
                return null;
            }
        })
    ]
});

import { getUserByEmail } from '@/app/lib/data/users';
import { compare } from 'bcryptjs';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { authConfig } from './auth.config';

export const { auth, signIn, signOut } = NextAuth({
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

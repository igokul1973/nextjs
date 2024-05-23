'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';

export async function authenticate(_: string | undefined, formData: FormData) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            if (error.type === 'CredentialsSignin') {
                return 'Invalid credentials';
            } else {
                return 'Something went wrong during authentication.';
            }
        }
        throw error;
    }
}

export async function logOut() {
    await signOut({ redirectTo: '/' });
}

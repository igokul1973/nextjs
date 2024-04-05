'use server';

import prisma from '@/app/lib/prisma';
import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import { TUser } from '../../definitions';
import { TGetUserPayload, getUserInclude } from './types';

export async function getUsersByEmail(email: string): Promise<TUser[]> {
    try {
        return prisma.user.findMany({
            where: {
                email
            }
        });
    } catch (error) {
        console.log('Failed to fetch user: ', error);
        throw new Error('Failed to fetch user.');
    }
}

export async function getUserByEmail(email: string): Promise<TGetUserPayload | null> {
    try {
        const user = await prisma.user.findUnique({
            include: getUserInclude,
            where: {
                email
            }
        });
        return user;
    } catch (error) {
        console.log('Failed to fetch user: ', error);
        throw new Error('Failed to fetch user.');
    }
}

export async function getUserById(id: string): Promise<{ id: string; email: string } | null> {
    try {
        const user = await prisma.user.findUnique({
            select: {
                id: true,
                email: true
            },
            where: {
                id
            }
        });
        return user;
    } catch (error) {
        console.log('Failed to fetch user: ', error);
        throw new Error('Failed to fetch user.');
    }
}

export async function authenticate(_: string | undefined, formData: FormData) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials';
                default:
                    return 'Something went wrong during authentication.';
            }
        }
        throw error;
    }
}

export async function logOut() {
    await signOut({ redirectTo: '/' });
}

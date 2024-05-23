import prisma from '@/app/lib/prisma';
import { TUser } from '@/app/lib/types';
import { unstable_noStore as noStore } from 'next/cache';
import { TGetUserPayload, TGetUserWithRelationsPayload, getUserWithRelations } from './types';

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
    noStore();
    try {
        const user = await prisma.user.findUnique({
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

export async function getUserWithRelationsByEmail(
    email: string
): Promise<TGetUserWithRelationsPayload | null> {
    noStore();

    try {
        const user = await prisma.user.findUnique({
            include: getUserWithRelations,
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

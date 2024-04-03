import prisma from '@/app/lib/prisma';
import { TGetUserPayload, getUserInclude } from './types';

export async function getUser(email: string): Promise<TGetUserPayload | null> {
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

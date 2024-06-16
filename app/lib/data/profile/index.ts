import prisma from '@/app/lib/prisma';
import { TProfile } from '@/app/lib/types';
import { unstable_noStore as noStore } from 'next/cache';

export async function getUserProfile(userId: string): Promise<TProfile | null> {
    noStore();

    try {
        return prisma.profile.findUnique({
            where: {
                userId
            }
        });
    } catch (error) {
        console.log('could not fetch user: ', error);
        throw new Error('could not fetch user profile.');
    }
}

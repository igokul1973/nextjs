'use server';

import prisma from '@/app/lib/prisma';
import { TAccount } from '@/app/lib/types';

export async function getUserAccount(userId: string): Promise<TAccount | null> {
    try {
        return prisma.account.findFirst({
            where: {
                users: {
                    some: {
                        id: userId
                    }
                }
            }
        });
    } catch (error) {
        console.log('Failed to fetch user: ', error);
        throw new Error('Failed to fetch user account.');
    }
}

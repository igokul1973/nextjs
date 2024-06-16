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
        console.log('could not fetch user: ', error);
        throw new Error('could not fetch user account.');
    }
}

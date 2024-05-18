import prisma from '@/app/lib/prisma';
import { TIndividualPayload, includeIndividualRelations } from './types';

export async function getIndividualById(
    id: string,
    accountId: string,
    isSuperAdmin = false
): Promise<TIndividualPayload | null> {
    try {
        return await prisma.individual.findUnique({
            include: includeIndividualRelations,
            where: {
                id,
                accountId: !isSuperAdmin ? { equals: accountId } : undefined
            }
        });
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch individual.');
    }
}

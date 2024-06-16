import prisma from '@/app/lib/prisma';
import { TOrganizationPayload, includeOrganizationRelations } from './types';

export async function getOrganizationById(
    id: string,
    accountId: string,
    isSuperAdmin = false
): Promise<TOrganizationPayload | null> {
    try {
        return await prisma.organization.findUnique({
            include: includeOrganizationRelations,
            where: {
                id,
                accountId: !isSuperAdmin ? { equals: accountId } : undefined
            }
        });
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('could not fetch organization.');
    }
}

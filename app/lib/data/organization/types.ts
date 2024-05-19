import { Prisma } from '@prisma/client';

export const includeOrganizationRelations = {
    logo: true,
    localIdentifierName: true,
    address: {
        include: {
            country: {
                include: {
                    localIdentifierNames: true
                }
            }
        }
    },
    emails: true,
    phones: true,
    customer: true
} satisfies Prisma.organizationInclude;

export type TOrganizationPayload = Prisma.organizationGetPayload<{
    include: typeof includeOrganizationRelations;
}>;

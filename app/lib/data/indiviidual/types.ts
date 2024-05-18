import { Prisma } from '@prisma/client';

export const includeIndividualRelations = {
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
} satisfies Prisma.individualInclude;

export type TIndividualPayload = Prisma.individualGetPayload<{
    include: typeof includeIndividualRelations;
}>;

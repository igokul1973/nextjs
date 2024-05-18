import { Prisma } from '@prisma/client';

export const includeEntityRelations = {
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

export const getUserWithRelations = {
    profile: {
        include: {
            avatar: true
        }
    },
    account: {
        include: {
            organizations: {
                include: {
                    ...includeEntityRelations,
                    type: true
                }
            },
            individuals: {
                include: includeEntityRelations
            }
        }
    }
} satisfies Prisma.userInclude;

export const getUserWithRelationsAndInventory = {
    profile: {
        include: {
            avatar: true
        }
    },
    account: {
        include: {
            organizations: {
                include: {
                    ...includeEntityRelations,

                    type: true
                }
            },
            individuals: {
                include: includeEntityRelations
            },
            inventory: true
        }
    }
} satisfies Prisma.userInclude;

export type TGetUserPayload = Prisma.userGetPayload<null>;

export type TGetUserWithRelationsPayload = Prisma.userGetPayload<{
    include: typeof getUserWithRelations;
}>;

export type TGetUserWithRelationsAndInventoryPayload = Prisma.userGetPayload<{
    include: typeof getUserWithRelationsAndInventory;
}>;

import { Prisma } from '@prisma/client';

export const getUserInclude = {
    account: {
        include: {
            organizations: {
                select: {
                    id: true,
                    name: true,
                    type: true,
                    isPrivate: true,
                    isCharity: true,
                    localIdentifierName: true,
                    localIdentifierValue: true,
                    customerId: true,
                    accountRelation: true,
                    address: {
                        include: {
                            country: true
                        }
                    },
                    phones: true,
                    emails: true
                }
            },
            individuals: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    middleName: true,
                    localIdentifierName: true,
                    localIdentifierValue: true,
                    customerId: true,
                    accountRelation: true,
                    address: {
                        include: {
                            country: true
                        }
                    },
                    phones: true,
                    emails: true
                }
            }
        }
    }
} satisfies Prisma.userInclude;

export type TGetUserPayload = Prisma.userGetPayload<{ include: typeof getUserInclude }>;

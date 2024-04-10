import { Prisma } from '@prisma/client';

export const getUserInclude = {
    account: {
        include: {
            organizations: {
                select: {
                    id: true,
                    name: true,
                    customerId: true,
                    accountRelation: true,
                    address: {
                        select: {
                            country: true
                        }
                    }
                }
            },
            individuals: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    middleName: true,
                    customerId: true,
                    accountRelation: true,
                    address: {
                        select: {
                            country: true
                        }
                    }
                }
            }
        }
    }
} satisfies Prisma.userInclude;

export type TGetUserPayload = Prisma.userGetPayload<{ include: typeof getUserInclude }>;

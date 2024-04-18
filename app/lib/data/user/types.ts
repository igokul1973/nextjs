import { inidividualsSelect, organizationsSelect } from '@/app/lib/data/customer/types';
import { Prisma } from '@prisma/client';

export const getUserInclude = {
    account: {
        include: {
            organizations: {
                select: organizationsSelect
            },
            individuals: {
                select: inidividualsSelect
            }
        }
    }
} satisfies Prisma.userInclude;

export type TGetUserPayload = Prisma.userGetPayload<{ include: typeof getUserInclude }>;

import { Prisma } from '@prisma/client';

export const fetchCustomersSelect = {
    id: true,
    individual: {
        select: {
            id: true,
            firstName: true,
            lastName: true,
            middleName: true,
            emails: {
                select: {
                    email: true
                }
            }
        }
    },
    organization: {
        select: {
            id: true,
            name: true,
            emails: {
                select: {
                    email: true
                }
            }
        }
    }
} satisfies Prisma.customerSelect;

export type TFetchCustomersPayload = Prisma.customerGetPayload<{
    select: typeof fetchCustomersSelect;
}>;

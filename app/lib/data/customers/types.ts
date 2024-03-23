import { Prisma } from '@prisma/client';

export const fetchCustomersSelect = {
    id: true,
    individual: {
        select: {
            id: true,
            firstName: true,
            lastName: true,
            middleName: true,
            individualEmail: {
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
            organizationEmail: {
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

export interface ICustomer {
    id: string;
    name: string;
    email: string;
}

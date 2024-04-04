import { Prisma } from '@prisma/client';

export const getCustomersSelect = {
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

export type TGetCustomersPayload = Prisma.customerGetPayload<{
    select: typeof getCustomersSelect;
}>;

export interface ICreateCustomerState {
    message?: string | null;
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
        date?: string[];
    };
}

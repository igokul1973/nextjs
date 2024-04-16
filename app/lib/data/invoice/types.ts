import { Prisma } from '@prisma/client';

export const getInvoiceSelect = {
    id: true,
    number: true,
    date: true,
    customerId: true,
    status: true,
    invoiceItems: {
        select: {
            id: true,
            price: true,
            quantity: true
        }
    }
} satisfies Prisma.invoiceSelect;

export type TGetInvoicePayload = Prisma.invoiceGetPayload<{ select: typeof getInvoiceSelect }>;

export interface ICreateInvoiceState {
    message?: string | null;
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
        date?: string[];
    };
}

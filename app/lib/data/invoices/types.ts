import { Prisma } from '@prisma/client';

export const fetchInvoiceSelect = {
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

export type TFetchInvoicePayload = Prisma.invoiceGetPayload<{ select: typeof fetchInvoiceSelect }>;

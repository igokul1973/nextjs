'use server';

import { TInvoiceForm, TInvoiceFormOutput } from '@/app/components/invoices/form/types';
import prisma from '@/app/lib/prisma';
import { InvoiceStatusEnum } from '@prisma/client';
import { unstable_noStore as noStore, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { TDirtyFields, TOrder } from '../../types';
import { flattenCustomer, formatCurrency, getDirtyValues } from '../../utils';
import {
    ICreateInvoiceState,
    TGetInvoicePayload,
    getInvoiceSelect,
    getQueryFilterWhereClause,
    invoicesInclude
} from './types';

const FormSchema = z.object({
    id: z.string(),
    customer_id: z.string({
        invalid_type_error: 'Please select a customer'
    }),
    amount: z.coerce
        .number()
        .gt(0, { message: 'Please enter an amount greater than 0' })
        .transform((val) => {
            return Math.floor(val * 100);
        }),
    status: z.enum(['pending', 'paid'], {
        invalid_type_error: 'Please select an invoice status'
    }),
    date: z.coerce.date()
});

const UpdateInvoice = FormSchema.omit({ id: true });
const CreateInvoice = FormSchema.omit({ id: true });

export async function getLatestInvoices(): Promise<LatestInvoice[]> {
    try {
        noStore();

        const invoices = await prisma.invoice.findMany({
            relationLoadStrategy: 'join',
            select: getInvoiceSelect,
            orderBy: {
                date: 'desc'
            },
            take: 5
        });

        const latestInvoices = invoices.map((invoice) => {
            const { number, date, invoiceItems, customerName, customerEmail } = invoice;
            const amount = invoiceItems.reduce((acc, ii) => {
                return acc + ii.quantity * ii.price;
            }, 0);
            return {
                number,
                date,
                amount: formatCurrency(amount),
                name: customerName,
                email: customerEmail
            };
        });

        return latestInvoices;

        // return [];
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to get the latest invoices.');
    }
}

export async function getInvoiceById(
    id: string
): Promise<(TGetInvoicePayload & { amount: number }) | null> {
    noStore();
    try {
        const invoice = await prisma.invoice.findFirst({
            relationLoadStrategy: 'query',
            select: getInvoiceSelect,
            where: {
                id
            }
        });

        if (!invoice) {
            return null;
        }

        const amount = invoice.invoiceItems.reduce((acc, ii) => {
            return acc + ii.quantity * ii.price;
        }, 0);

        return { ...invoice, amount: amount / 100 };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to get invoice.');
    }
}

export async function getFilteredInvoicesByAccountId(
    accountId: string,
    query: string,
    currentPage: number,
    itemsPerPage: number,
    orderBy: string = 'number',
    order: TOrder = 'asc'
) {
    noStore();

    const offset = currentPage * itemsPerPage;

    try {
        const rawInvoices = await prisma.invoice.findMany({
            relationLoadStrategy: 'join',
            take: itemsPerPage,
            skip: offset,
            orderBy: {
                [orderBy]: order
            },
            include: invoicesInclude,
            where: getQueryFilterWhereClause(accountId, query)
        });
        // Adding invoice amount
        const invoices = rawInvoices.map((invoice) => {
            const rawCustomer = { ...invoice.customer };
            const customer = flattenCustomer(rawCustomer);

            const amount = formatCurrency(
                invoice.invoiceItems.reduce((acc, ii) => {
                    return acc + ii.quantity * ii.price;
                }, 0)
            );
            return { ...invoice, amount, customer, date: invoice.date.toLocaleDateString() };
        });

        return invoices;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to get invoices.');
    }
}

export async function getFilteredInvoicesByAccountIdCount(accountId: string, query: string) {
    noStore();

    try {
        // const status = Object.values(InvoiceStatusEnum).find((s) => s.includes(query));

        const count = await prisma.invoice.count({
            where: getQueryFilterWhereClause(accountId, query)
        });

        return count;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to get total number of invoices.');
    }
}

export async function createInvoice(formData: TInvoiceFormOutput): Promise<ICreateInvoiceState> {
    // Creating invoice in DB
    try {
        const { invoiceItems, status, ...invoice } = formData;

        console.log('Invoice items: ', invoiceItems);
        console.log('Invoice: ', invoiceItems);

        const data = {
            status: status as InvoiceStatusEnum,
            ...invoice,
            invoiceItems: { create: invoiceItems }
        };

        await prisma.invoice.create({ data });
        console.log('Successfully created invoice.');
    } catch (error) {
        console.error('Database Error:', error);
        return {
            message: 'Database Error: Failed to create invoice.'
        };
    }
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function updateInvoice(
    formData: TInvoiceForm,
    dirtyFields: TDirtyFields<TInvoiceForm>,
    userId: string
) {
    const changedFields = getDirtyValues<TInvoiceForm>(dirtyFields, formData);
    const data = { ...changedFields, updatedBy: userId };

    try {
        const { id, ...invoice } = data;
        // await prisma.invoice.update({ where: {
        //         id
        //     },
        //     data
        // });
        console.log('Successfully updated invoice.');
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to delete invoice.');
    }
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoiceById(
    id: string,
    status: InvoiceStatusEnum
): Promise<{ message: string }> {
    if (!id) {
        throw Error('The id must be a valid UUID');
    }
    if (status === InvoiceStatusEnum.paid) {
        throw new Error(`The invoice with ID: ${id} has already been paid and cannot be deleted.`);
    }

    try {
        await prisma.invoice.delete({
            where: {
                id
            }
        });
        const successMessage = `Successfully deleted invoice with ID: ${id}.`;
        console.log(successMessage);

        revalidatePath('/dashboard/invoices');
        return { message: successMessage };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error(`Database Error: failed to delete invoice with ID: ${id}`);
    }
}

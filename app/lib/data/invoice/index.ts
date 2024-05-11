'use server';

import { TInvoiceFormOutput } from '@/app/components/invoices/form/types';
import prisma from '@/app/lib/prisma';
import { InvoiceStatusEnum, Prisma } from '@prisma/client';
import { unstable_noStore as noStore, revalidatePath } from 'next/cache';
import { TDirtyFields, TOrder } from '../../types';
import { flattenCustomer, formatCurrency, getDirtyValues } from '../../utils';
import {
    TGetInvoiceWithRelationsPayloadRaw,
    getInvoiceSelect,
    getQueryFilterWhereClause,
    invoicesInclude
} from './types';

export interface ILatestInvoice {
    number: string;
    date: Date;
    amount: string;
    name: string;
    email: string;
}

export async function getLatestInvoices(): Promise<ILatestInvoice[]> {
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
                return acc + ii.quantity * Number(ii.price);
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

// FIXME: Continue here - need type fo the invoice
const transformInvoice = (invoice: TGetInvoiceWithRelationsPayloadRaw) => {
    const { invoiceItems: rawInvoiceItems, customer: rawCustomer, ...partialInvoice } = invoice;
    const invoiceItems = rawInvoiceItems.map((ii) => {
        return {
            ...ii,
            price: Number(ii.price)
        };
    });

    const customer = flattenCustomer(rawCustomer);
    const amount = formatCurrency(
        invoiceItems.reduce((acc, ii) => {
            return acc + ii.quantity * ii.price;
        }, 0)
    );

    return {
        ...partialInvoice,
        amount,
        customer,
        invoiceItems,
        date: invoice.date.toLocaleDateString()
    };
};

export async function getInvoiceById(id: string) {
    noStore();
    try {
        const invoice = await prisma.invoice.findFirst({
            relationLoadStrategy: 'query',
            include: invoicesInclude,
            where: {
                id
            }
        });

        if (!invoice) {
            return null;
        }

        return transformInvoice(invoice);
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
            return transformInvoice(invoice);
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

export async function createInvoice(formData: TInvoiceFormOutput): Promise<void> {
    // FIXME: The phone on the create/update form does not get selected automatically
    // and allows to save without selected phone - check it out, along with the email.
    try {
        const { customer, ...data } = formData;
        delete customer.customerType;

        const { invoiceItems, status, ...partialInvoice } = data;

        const invoice = {
            status: status as InvoiceStatusEnum,
            invoiceItems: {
                create: invoiceItems.map((ii) => {
                    const { inventoryItem, ...item } = ii;
                    return {
                        ...item
                    };
                })
            },
            ...customer,
            ...partialInvoice
        };

        const d = await prisma.invoice.create({ data: invoice });
        console.log('Successfully created invoice: ', d);
        revalidatePath('/dashboard/invoices');
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Database Error: Failed to create the invoice.');
    }
}

export async function updateInvoice(
    formData: TInvoiceFormOutput,
    dirtyFields: TDirtyFields<TInvoiceFormOutput>,
    userId: string
) {
    const changedFields = getDirtyValues<TInvoiceFormOutput>(dirtyFields, formData);

    if (!changedFields) {
        return null;
    }

    try {
        const { customer, invoiceItems, status, ...partialChangedFields } = changedFields;

        let data: Prisma.XOR<Prisma.invoiceUpdateInput, Prisma.invoiceUncheckedUpdateInput> = {
            ...partialChangedFields,
            updatedBy: userId
        };

        if (customer && Object.keys(customer).length > 0) {
            delete customer.customerType;

            data = { ...data, ...customer };
        }

        if (invoiceItems && invoiceItems.length > 0) {
            // Stripping invoice item of id and adding updatedBy value
            const preparedInvoiceItems = invoiceItems.map((ii) => {
                const { id, inventoryItem, ...item } = ii;
                return {
                    ...item,
                    updatedBy: userId
                };
            });
            const invoiceItemsData = {
                invoiceItems: {
                    deleteMany: {
                        invoiceId: formData.id
                    },
                    createMany: {
                        data: preparedInvoiceItems
                    }
                }
            };

            data = {
                ...data,
                ...invoiceItemsData
            };
        }

        if (status) {
            data = {
                ...data,
                status: status as InvoiceStatusEnum
            };
        }

        await prisma.invoice.update({
            where: {
                id: formData.id
            },
            data
        });

        console.log('Successfully updated invoice with ID:', formData.id);
        revalidatePath('/dashboard/invoices');
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Database Error: Failed to update the invoice.');
    }
}

export async function deleteInvoiceById(id: string, status: InvoiceStatusEnum): Promise<void> {
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
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error(`Database Error: failed to delete invoice with ID: ${id}`);
    }
}

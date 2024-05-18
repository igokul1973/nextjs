'use server';

import { TInvoiceFormOutput } from '@/app/components/invoices/form/types';
import prisma from '@/app/lib/prisma';
import { InvoiceStatusEnum, Prisma } from '@prisma/client';
import { unstable_noStore as noStore, revalidatePath } from 'next/cache';
import { TDirtyFields, TFile, TOrder } from '../../types';
import { flattenCustomer, getDirtyValues, getUser } from '../../utils';
import {
    TGetInvoiceWithRelationsPayloadRaw,
    TTransformedInvoice,
    getQueryFilterWhereClause,
    invoicesInclude
} from './types';

// FIXME: Continue here - need type fo the invoice
const transformInvoice = (invoice: TGetInvoiceWithRelationsPayloadRaw): TTransformedInvoice => {
    const { invoiceItems: rawInvoiceItems, customer: rawCustomer, ...partialInvoice } = invoice;
    const invoiceItems = rawInvoiceItems.map((ii) => {
        return {
            ...ii,
            price: Number(ii.price)
        };
    });

    const customer = flattenCustomer(rawCustomer);
    const amount = invoiceItems.reduce((acc, ii) => {
        return acc + ii.quantity * ii.price;
    }, 0);
    return {
        ...partialInvoice,
        amount,
        customer,
        invoiceItems
    };
};

export async function getInvoiceById(
    id: string,
    accountId: string,
    isAdmin = false
): Promise<TTransformedInvoice | null> {
    noStore();
    try {
        const invoice = await prisma.invoice.findFirst({
            relationLoadStrategy: 'query',
            include: invoicesInclude,
            where: {
                id,
                createdByUser: !isAdmin
                    ? {
                          is: {
                              account: {
                                  is: {
                                      id: accountId
                                  }
                              }
                          }
                      }
                    : undefined
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
    try {
        const { provider } = await getUser();
        const { customer: rawCustomer, createdBy, updatedBy, ...invoice } = formData;
        const { customerId, customerType, ...customer } = rawCustomer;

        let providerLogo: Omit<TFile, 'id' | 'createdAt' | 'updatedAt'> | undefined = undefined;

        if (provider?.logo) {
            const {
                id,
                createdBy: createdByLogo,
                updatedBy: updatedByLogo,
                createdAt,
                updatedAt,
                ...logo
            } = provider.logo;
            providerLogo = {
                ...logo,
                createdBy: createdBy,
                updatedBy: updatedBy
            };
        }

        const { invoiceItems, status, ...partialInvoice } = invoice;

        const data: Prisma.invoiceCreateInput = {
            status: status as InvoiceStatusEnum,
            invoiceItems: {
                create: invoiceItems.map((ii) => {
                    const { inventoryItem, ...item } = ii;
                    return {
                        ...item
                    };
                })
            },
            createdByUser: {
                connect: {
                    id: createdBy
                }
            },
            updatedByUser: {
                connect: {
                    id: createdBy
                }
            },
            providerLogo: providerLogo && {
                create: providerLogo
            },
            ...customer,
            customer: {
                connect: {
                    id: customerId
                }
            },
            ...partialInvoice
        };

        const d = await prisma.invoice.create({ data });
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
    try {
        const changedFields = getDirtyValues<TInvoiceFormOutput>(dirtyFields, formData);

        if (!changedFields) {
            return null;
        }

        const { provider } = await getUser();

        let providerLogo: Omit<TFile, 'id' | 'createdAt' | 'updatedAt'> | undefined = undefined;

        if (!provider) {
            throw new Error('No provider was found, redirecting...', { cause: 'NO_PROVIDER' });
        } else if (provider.logo) {
            const {
                id,
                createdBy: createdByLogo,
                updatedBy: updatedByLogo,
                createdAt,
                updatedAt,
                ...logo
            } = provider.logo;

            providerLogo = {
                ...logo,
                createdBy: userId,
                updatedBy: userId
            };
        }

        const {
            customer: rawCustomer,
            invoiceItems,
            status,
            ...partialChangedFields
        } = changedFields;

        let data: Prisma.invoiceUpdateInput = {
            ...partialChangedFields,
            providerLogo: {
                delete: true,
                create: providerLogo
            },
            updatedByUser: {
                connect: {
                    id: userId
                }
            }
        };

        if (rawCustomer && Object.keys(rawCustomer).length > 0) {
            const { customerId, customerType, ...customer } = rawCustomer;

            data = { ...data, ...customer, customer: { connect: { id: customerId } } };
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

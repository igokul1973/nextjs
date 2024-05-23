'use server';

import { TInvoiceFormOutput } from '@/app/components/invoices/form/types';
import prisma from '@/app/lib/prisma';
import { TDirtyFields, TFile } from '@/app/lib/types';
import { getDirtyValues, getUser } from '@/app/lib/utils';
import { InvoiceStatusEnum, Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

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
        throw new Error('database error: failed to create invoice');
    }
}

export async function updateInvoice(
    formData: TInvoiceFormOutput,
    dirtyFields: TDirtyFields<TInvoiceFormOutput>,
    userId: string
) {
    'use server';
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
            providerLogoId,
            ...partialChangedFields
        } = changedFields;

        let data: Prisma.invoiceUpdateInput = {
            ...partialChangedFields,
            providerLogo: {
                delete: !!formData.providerLogoId,
                upsert: providerLogo && {
                    create: providerLogo,
                    update: providerLogo
                }
                // create: !!!formData.providerLogoId && providerLogo,
                // update: !!formData.providerLogoId &&
                //     providerLogo && {
                //         data: providerLogo,
                //         where: {
                //             id: formData.providerLogoId
                //         }
                //     }
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

        const updatedInvoice = await prisma.invoice.update({
            where: {
                id: formData.id
            },
            data
        });

        console.log('Successfully updated invoice with ID:', updatedInvoice.id);
        revalidatePath('/dashboard/invoices');
        return updatedInvoice;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('database error: failed to update invoice');
    }
}

export async function deleteInvoiceById(id: string, status: InvoiceStatusEnum): Promise<void> {
    'use server';
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
        throw new Error(`database error: failed to delete invoice`);
    }
}

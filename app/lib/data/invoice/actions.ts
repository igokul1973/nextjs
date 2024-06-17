'use server';

import { TInvoiceFormOutput } from '@/app/components/invoices/form/types';
import { baseUrl } from '@/app/lib/constants';
import prisma from '@/app/lib/prisma';
import { TDirtyFields, TFile } from '@/app/lib/types';
import { getDirtyValues, getUser } from '@/app/lib/utils';
import { getI18n } from '@/locales/server';
import { InvoiceStatusEnum, Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function createInvoice(formData: TInvoiceFormOutput): Promise<void> {
    const t = await getI18n();
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
                    const { inventoryItem, measurementUnit, ...item } = ii;
                    return {
                        ...item,
                        measurementUnitId: measurementUnit.id
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
        throw new Error(t('could not create invoice'));
    }
}

export async function updateInvoice(
    formData: TInvoiceFormOutput,
    dirtyFields: TDirtyFields<TInvoiceFormOutput>
) {
    const t = await getI18n();
    try {
        const { user } = await getUser();
        const userId = user.id;
        const changedFields = getDirtyValues<TInvoiceFormOutput>(dirtyFields, formData);

        if (!changedFields) {
            throw Error('No changes detected');
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
                const { id, inventoryItem, measurementUnit, ...item } = ii;
                return {
                    ...item,
                    measurementUnitId: measurementUnit.id,
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
        throw new Error(t('could not update invoice'));
    }
}

export async function deleteInvoiceById(id: string, status: InvoiceStatusEnum): Promise<void> {
    const t = await getI18n();
    try {
        if (!id) {
            throw Error('The id must be a valid UUID');
        }

        if (status === InvoiceStatusEnum.paid) {
            throw new Error(
                `The invoice with ID: ${id} has already been paid and cannot be deleted.`
            );
        }

        await prisma.invoice.delete({
            where: {
                id
            }
        });
        const successMessage = `Successfully deleted invoice with ID: ${id}.`;
        console.log(successMessage);

        revalidatePath('/dashboard/invoices');
    } catch (error) {
        console.error('Error:', error);
        throw new Error(t('could not delete invoice'));
    }
}

export const fetchPdfUrl = async (
    accountId: string,
    entityId: string,
    d: Record<string, unknown>
) => {
    'use server';
    try {
        const r = await fetch(`${baseUrl}/api/create/pdf`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                bucket: 'invoices',
                accountId: accountId,
                entityId: entityId,
                pageSettings: {
                    pageMargins: [20, 80, 20, 100]
                },
                data: d
            }),
            cache: 'no-store'
        });

        const json = await r.json();

        if (!r.ok) {
            throw new Error(json.error);
        }

        return json.url;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

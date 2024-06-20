'use server';

import {
    getInvoiceCreateSchema,
    getInvoiceUpdateSchema
} from '@/app/components/invoices/form/formSchema';
import { TInvoiceFormOutput } from '@/app/components/invoices/form/types';
import { baseUrl } from '@/app/lib/constants';
import prisma from '@/app/lib/prisma';
import { TDirtyFields, TFile } from '@/app/lib/types';
import { copyFileInStorage, deleteFileInStorage, getDirtyValues, getUser } from '@/app/lib/utils';
import { getI18n } from '@/locales/server';
import { InvoiceStatusEnum, Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function createInvoice(formData: TInvoiceFormOutput) {
    const t = await getI18n();
    try {
        const { account, provider } = await getUser();

        if (!provider) {
            throw new Error(t('no provider was found, redirecting...'), { cause: 'NO_PROVIDER' });
        }

        const validationSchema = getInvoiceCreateSchema(t);

        const validatedFormData = validationSchema.safeParse(formData);

        if (!validatedFormData.success) {
            throw Error('Form is invalid');
        }

        const validatedData = validatedFormData.data;

        const { customer: rawCustomer, createdBy, updatedBy, ...invoice } = validatedData;
        const { customerId, customerType, ...customer } = rawCustomer;

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
            ...customer,
            customer: {
                connect: {
                    id: customerId
                }
            },
            ...partialInvoice
        };

        const createdInvoice = await prisma.invoice.create({ data });
        // Saving the provider logo, if any, to storage and DB
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

        // Copying the provider logo in file storage and getting its URL
        // in order to save it in DB as the invoice provider logo
        // In other words, the logo files for the provider and the invoice
        // are 2 separate files having 2 different URLs.
        const sourcePath = provider?.logo?.url.split('/').slice(-2).join('/');

        if (sourcePath && provider.logo) {
            const url = await copyFileInStorage(
                sourcePath,
                'images',
                account.id,
                createdInvoice.id,
                provider.logo.name
            );

            if (url && providerLogo) {
                providerLogo = {
                    ...providerLogo,
                    url
                };
            }
        }

        const updatedInvoice = await prisma.invoice.update({
            data: {
                providerLogo: providerLogo && {
                    create: providerLogo
                }
            },
            where: {
                id: createdInvoice.id
            }
        });

        console.log('Successfully created invoice: ', updatedInvoice);
        revalidatePath('/dashboard/invoices');

        return updatedInvoice;
    } catch (error) {
        console.error('Database Error:', error);

        if (error instanceof Error && error.cause === 'NO_PROVIDER') {
            throw new Error(error.message, { cause: 'NO_PROVIDER' });
        }
        throw new Error(t('could not create invoice'));
    }
}

export async function updateInvoice(
    formData: TInvoiceFormOutput,
    dirtyFields: TDirtyFields<TInvoiceFormOutput>
) {
    const t = await getI18n();
    try {
        const { user, account, provider } = await getUser();
        const userId = user.id;

        const validationSchema = getInvoiceUpdateSchema(t);

        const validatedFormData = validationSchema.safeParse(formData);

        if (!validatedFormData.success) {
            throw Error('Form is invalid');
        }

        const validatedData = validatedFormData.data;

        let changedFields = getDirtyValues<TInvoiceFormOutput>(dirtyFields, validatedData);

        if (!changedFields) {
            throw Error(t('no changes detected'));
        }

        if (!provider) {
            throw new Error(t('no provider was found, redirecting...'), { cause: 'NO_PROVIDER' });
        }

        // Making sure this endpoint cannot be hit for invoices
        // whose status was not DRAFT.
        const invoice = await prisma.invoice.findUnique({
            select: {
                status: true
            },
            where: {
                id: validatedData.id
            }
        });

        if (!invoice) {
            throw new Error(t('no invoice was found, redirecting...'), { cause: 'NO_INVOICE' });
        }

        if (invoice.status !== InvoiceStatusEnum.draft) {
            throw new Error(
                'Attempt to update Invoice whose status is not "DRAFT". Forbidden by business logic!'
            );
        }

        // If the invoice is a 'draft', or it is changing status (most probably to something
        // other than 'draft') we need to set the customer and provider
        // fields' values for the invoice in the DB anew because we do not know if
        // those fields have changed in Customer or Provider respectively from
        // the point in time the invoice was initially created and now.
        // Else (for all other statuses) - the customer and provider fields' values
        // will stay the same because we fixate all other invoice fields values to
        // a point of time when status changed from the DRAFT to anything else.
        let providerLogo: Omit<TFile, 'id' | 'createdAt' | 'updatedAt'> | undefined = undefined;

        if (
            formData.status === InvoiceStatusEnum.draft ||
            ('status' in changedFields && changedFields.status)
        ) {
            const {
                customer,
                customerLocalIdentifierNameAbbrev,
                customerLocalIdentifierValue,
                providerName,
                providerAddressLine1,
                providerAddressLine2,
                providerAddressLine3,
                providerLocality,
                providerRegion,
                providerPostCode,
                providerCountry,
                providerPhone,
                providerEmail,
                providerLocalIdentifierNameAbbrev,
                providerLocalIdentifierValue
            } = validatedData;

            changedFields = {
                ...changedFields,
                customer,
                customerLocalIdentifierNameAbbrev,
                customerLocalIdentifierValue,
                providerName,
                providerAddressLine1,
                providerAddressLine2,
                providerAddressLine3,
                providerLocality,
                providerRegion,
                providerPostCode,
                providerCountry,
                providerPhone,
                providerEmail,
                providerLocalIdentifierNameAbbrev,
                providerLocalIdentifierValue
            };

            if (provider.logo) {
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
        }

        const {
            customer: rawCustomer,
            invoiceItems,
            status,
            providerLogoId,
            ...partialChangedFields
        } = changedFields;

        // Removing provider logo from file storage if it exists
        if (validatedData.providerLogoId) {
            const file = await prisma.file.findUnique({
                where: {
                    id: validatedData.providerLogoId
                }
            });
            if (file) {
                await deleteFileInStorage(file.name, 'images', account.id, validatedData.id);
            }
        }

        // Now copying the provider logo in file storage and getting its URL
        // in order to save it in DB as the invoice provider logo
        // In other words, the logo files for the provider and the invoice
        // are 2 separate files having 2 different URLs.
        const sourcePath = provider.logo?.url.split('/').slice(-2).join('/');
        if (sourcePath && provider.logo) {
            const url = await copyFileInStorage(
                sourcePath,
                'images',
                account.id,
                validatedData.id,
                provider.logo.name
            );

            if (url && providerLogo) {
                providerLogo = {
                    ...providerLogo,
                    url
                };
            }
        }

        let data: Prisma.invoiceUpdateInput = {
            ...partialChangedFields,
            providerLogo: {
                // Removing provider logo from DB if it exists
                delete: !!validatedData.providerLogoId,
                // Creating again because we do not
                // know if the provider had it changed
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
                        invoiceId: validatedData.id
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
                id: validatedData.id
            },
            data
        });

        console.log('Successfully updated invoice with ID:', updatedInvoice.id);
        revalidatePath('/dashboard/invoices');
        return updatedInvoice;
    } catch (error) {
        console.error('Error:', error);
        if (error instanceof Error && error.cause === 'NO_PROVIDER') {
            if (
                error.cause === 'NO_PROVIDER' ||
                error.cause === 'NO_CUSTOMER' ||
                error.cause === 'NO_INVOICE'
            ) {
                throw error;
            }
        }
        throw new Error(t('could not update invoice'));
    }
}

export async function deleteInvoiceById(id: string): Promise<void> {
    const t = await getI18n();
    const { account } = await getUser();

    try {
        if (!id) {
            throw Error('The id must be a valid UUID');
        }

        // Making sure this endpoint cannot be hit for invoices
        // whose status was not DRAFT.
        const invoice = await prisma.invoice.findUnique({
            include: {
                providerLogo: true
            },
            where: {
                id
            }
        });

        if (!invoice) {
            throw new Error('invoice not found');
        }

        if (invoice.status !== InvoiceStatusEnum.draft) {
            throw new Error(
                'Attempt to update Invoice whose status is not "DRAFT". Forbidden by business logic!'
            );
        }

        if (invoice.providerLogo) {
            await deleteFileInStorage(invoice.providerLogo.name, 'images', account.id, id);
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

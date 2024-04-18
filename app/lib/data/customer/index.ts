'use server';

import { TEmail, TIndividualForm, TPhone } from '@/app/components/individuals/create-form/types';
import { TOrganizationForm } from '@/app/components/organizations/create-form/types';
import prisma from '@/app/lib/prisma';
import { flattenCustomer, formatCurrency } from '@/app/lib/utils';
import {
    AccountRelationEnum,
    EmailTypeEnum,
    InvoiceStatusEnum,
    PhoneTypeEnum,
    Prisma
} from '@prisma/client';
import { unstable_noStore as noStore, revalidatePath } from 'next/cache';
import {
    getCustomersSelect,
    TGetCustomerPayload,
    getFilteredCustomersByAccountIdSelect,
    getFilteredCustomersWhereClause
} from './types';

export async function getCustomerById(id: string): Promise<TGetCustomerPayload | null> {
    try {
        return await prisma.customer.findUnique({
            select: {
                ...getCustomersSelect
            },
            where: {
                id
            }
        });
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch customer.');
    }
}

export async function getCustomersByAccountId(accountId: string) {
    noStore();
    try {
        const customers = await prisma.customer.findMany({
            relationLoadStrategy: 'query',
            select: getCustomersSelect,
            where: {
                AND: [
                    {
                        organization: {
                            account: {
                                id: {
                                    equals: accountId
                                }
                            }
                        }
                    },
                    {
                        OR: [
                            {
                                organization: {
                                    accountRelation: AccountRelationEnum.customer
                                }
                            },
                            {
                                individual: {
                                    accountRelation: AccountRelationEnum.customer
                                }
                            }
                        ]
                    }
                ]
            }
        });

        return customers
            .map((c) => {
                return flattenCustomer(c);
            })
            .sort((c1, c2) => {
                return c1.name.localeCompare(c2.name);
            });
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch all customers.');
    }
}

export async function getFilteredCustomersByAccountId(
    accountId: string,
    query: string,
    currentPage: number,
    itemsPerPage: number
) {
    noStore();
    try {
        const offset = currentPage * itemsPerPage;

        const rawCustomers = await prisma.customer.findMany({
            relationLoadStrategy: 'join',
            orderBy: [
                {
                    organization: {
                        name: 'asc'
                    }
                },
                {
                    individual: {
                        lastName: 'asc'
                    }
                }
            ],
            take: itemsPerPage,
            skip: offset,
            select: getFilteredCustomersByAccountIdSelect,
            where: getFilteredCustomersWhereClause(query, accountId)
        });

        // Preparing customer objejct
        const customers = rawCustomers.map((rawCustomer) => {
            const { totalPendingRaw, totalPaidRaw } = rawCustomer.invoices.reduce(
                ({ totalPendingRaw, totalPaidRaw }, i) => {
                    const invoiceTotal = i.invoiceItems.reduce((acc, ii) => {
                        return acc + ii.quantity * ii.price;
                    }, 0);
                    if (i.status === InvoiceStatusEnum.pending) {
                        return { totalPendingRaw: totalPendingRaw + invoiceTotal, totalPaidRaw };
                    } else if (i.status === InvoiceStatusEnum.paid) {
                        return { totalPendingRaw, totalPaidRaw: totalPaidRaw + invoiceTotal };
                    }
                    return { totalPendingRaw, totalPaidRaw };
                },
                { totalPendingRaw: 0, totalPaidRaw: 0 }
            );

            const customer = flattenCustomer(rawCustomer);

            const totalPending = formatCurrency(totalPendingRaw ?? '0');
            const totalPaid = formatCurrency(totalPaidRaw ?? '0');

            return {
                ...customer,
                totalPending,
                totalPaid,
                totalInvoices: rawCustomer._count.invoices
            };
        });

        return customers;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch customer table.');
    }
}

export async function getFilteredCustomersCountByAccountId(accountId: string, query: string) {
    noStore();
    try {
        return await prisma.customer.count({
            where: getFilteredCustomersWhereClause(query, accountId)
        });
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch customers count.');
    }
}

export async function deleteCustomerById(id: string) {
    return prisma.customer.delete({
        where: {
            id
        }
    });
}

export async function createCustomer(formData: TIndividualForm | TOrganizationForm) {
    // Creating customer in DB
    try {
        const {
            address,
            phones,
            emails,
            accountRelation,
            localIdentifierNameId,
            accountId,
            ...entity
        } = formData;

        let data: Prisma.XOR<
            Prisma.customerCreateInput,
            Prisma.customerUncheckedCreateInput
        > | null = null;

        const createEntityObject = {
            ...entity,
            accountRelation: accountRelation as AccountRelationEnum,
            account: {
                connect: {
                    id: accountId
                }
            },
            localIdentifierName: {
                connect: {
                    id: localIdentifierNameId
                }
            },
            address: {
                create: address
            },
            phones: {
                create: phones as unknown as Omit<TPhone, 'type'> & {
                    type: PhoneTypeEnum;
                }
            },
            emails: {
                create: emails as unknown as Omit<TEmail, 'type'> & {
                    type: EmailTypeEnum;
                }
            }
        };
        if ('typeId' in createEntityObject) {
            const { typeId, ...createEntityObjectWithoutType } = createEntityObject;

            const createEntityObjectWithType = {
                ...createEntityObjectWithoutType,
                type: {
                    connect: {
                        id: typeId
                    }
                }
            };

            data = {
                organization: {
                    create: createEntityObjectWithType
                }
            };
        } else if ('firstName' in createEntityObject) {
            data = {
                individual: {
                    create: createEntityObject
                }
            };
        }

        if (!data) {
            throw new Error('Failed to create customer.');
        }

        const newCustomer = await prisma.customer.create({
            data,
            select: {
                id: true,
                isActive: true,
                organization: true,
                individual: true
            }
        });

        console.log('Successfully created new customer: ', newCustomer);

        return newCustomer;
    } catch (error) {
        console.error('Database Error:', error);
        throw error;
    }
}

// export async function updateCustomer(id: string, formData: TIndividualForm | TOrganizationForm) {
//     // Creating customer in DB
//     try {
//         await prisma.customer.update({
//             where: {
//                 id
//             },
//             formData
//         });
//         console.log('Successfully updated customer.');
//     } catch (error) {
//         console.error('Database Error:', error);
//         throw new Error('Failed to delete customer.');
//     }
//     revalidatePath('/dashboard/customers');
//     redirect('/dashboard/customers');
// }

export async function deleteCustomer(id: string): Promise<{ message: string }> {
    if (!id) {
        throw Error('The id must be a valid UUID');
    }

    // Creating customer in DB
    try {
        await deleteCustomerById(id);
        const successMessage = 'Successfully deleted customer.';
        console.log(successMessage);

        revalidatePath('/dashboard/customers');
        return { message: successMessage };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Database Error: failed to delete Customer.');
    }
}

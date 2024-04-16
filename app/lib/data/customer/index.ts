'use server';

import { TIndividualForm } from '@/app/components/individuals/create-form/types';
import prisma from '@/app/lib/prisma';
import { flattenCustomer, formatCurrency } from '@/app/lib/utils';
import { AccountRelationEnum, EntitiesEnum, InvoiceStatusEnum } from '@prisma/client';
import { unstable_noStore as noStore, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import {
    ICreateCustomerState,
    getCustomersSelect,
    getFilteredCustomersByAccountIdSelect,
    getFilteredCustomersWhereClause
} from './types';

const ITEMS_PER_PAGE = 6;

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
        invalid_type_error: 'Please select an customer status'
    }),
    date: z.coerce.date()
});

const UpdateCustomer = FormSchema.omit({ id: true });
const CreateCustomer = FormSchema.omit({ id: true });

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
    currentPage: number
) {
    noStore();
    try {
        const offset = (currentPage - 1) * ITEMS_PER_PAGE;

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
            take: ITEMS_PER_PAGE,
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

export async function getFilteredCustomersCountByAccountId(query: string, accountId: string) {
    noStore();
    try {
        const count = await prisma.customer.count({
            where: getFilteredCustomersWhereClause(query, accountId)
        });

        const totalPages = Math.ceil(Number(count) / ITEMS_PER_PAGE);
        return totalPages;
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

export async function createCustomer(
    formData: TIndividualForm | TOrganizationForm,
    type: EntitiesEnum
): Promise<ICreateCustomerState> {
    // Creating customer in DB
    try {
        if (type === EntitiesEnum.organization) {
            const { address, phones, emails, attributes, ...organization } = formData;
            await prisma.customer.create({
                data: {
                    organization: {
                        create: {
                            ...formData
                        }
                    }
                }
            });
        } else if (type === CustomerTypeEnum.INDIVIDUAL) {
        }
        // const data = { individuals: 'bla' };
        // await prisma.customer.create({
        //     data,
        //     include: {
        //         individual: {
        //             data: {}
        //         }
        //     }
        // });
        console.log('Successfully created customer.');
    } catch (error) {
        console.error('Database Error:', error);
        return {
            message: 'Database Error: Failed to create customer.'
        };
    }
    revalidatePath('/dashboard/customers');
    redirect('/dashboard/customers');
}

export async function updateCustomer(id: string, formData: FormData) {
    const rawFormData = Object.fromEntries(formData.entries());
    const dateISOString = new Date().toISOString();
    rawFormData.date = dateISOString;

    const data = UpdateCustomer.parse(rawFormData);

    // Creating customer in DB
    try {
        await prisma.customer.update({
            where: {
                id
            },
            data
        });
        console.log('Successfully updated customer.');
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to delete customer.');
    }
    revalidatePath('/dashboard/customers');
    redirect('/dashboard/customers');
}

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

'use server';

import prisma from '@/app/lib/prisma';
import { flattenCustomer, formatCurrency } from '@/app/lib/utils';
import { AccountRelationEnum, InvoiceStatusEnum } from '@prisma/client';
import { unstable_noStore as noStore, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { ICreateCustomerState, getCustomersSelect } from './types';

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
            // questionable orderBy, gotta check
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
            select: {
                id: true,
                organization: {
                    select: {
                        id: true,
                        name: true,
                        emails: {
                            select: {
                                email: true
                            }
                        }
                    }
                },
                individual: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        middleName: true,
                        emails: {
                            select: {
                                email: true
                            }
                        }
                    }
                },
                _count: true,
                invoices: {
                    select: {
                        id: true,
                        status: true,
                        invoiceItems: {
                            select: {
                                id: true,
                                name: true,
                                price: true,
                                quantity: true
                            }
                        }
                    }
                }
            },
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
                    },
                    {
                        OR: [
                            {
                                organization: {
                                    OR: [
                                        {
                                            name: {
                                                contains: query,
                                                mode: 'insensitive'
                                            }
                                        },
                                        {
                                            emails: {
                                                some: {
                                                    email: {
                                                        contains: query,
                                                        mode: 'insensitive'
                                                    }
                                                }
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                individual: {
                                    OR: [
                                        {
                                            firstName: {
                                                contains: query,
                                                mode: 'insensitive'
                                            }
                                        },
                                        {
                                            lastName: {
                                                contains: query,
                                                mode: 'insensitive'
                                            }
                                        },
                                        {
                                            middleName: {
                                                contains: query,
                                                mode: 'insensitive'
                                            }
                                        },
                                        {
                                            emails: {
                                                some: {
                                                    email: {
                                                        contains: query,
                                                        mode: 'insensitive'
                                                    }
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                ]
            }
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

export async function fetchFilteredCustomersCount(query: string) {
    noStore();
    try {
        const status = Object.values(InvoiceStatusEnum).find((s) => s.includes(query));
        const count = await prisma.customer.count({
            where: {
                OR: [
                    {
                        invoices: {
                            some: {
                                status: {
                                    equals: status
                                }
                            }
                        }
                    },
                    {
                        organization: {
                            OR: [
                                {
                                    name: {
                                        contains: query,
                                        mode: 'insensitive'
                                    }
                                },
                                {
                                    emails: {
                                        some: {
                                            email: {
                                                contains: query,
                                                mode: 'insensitive'
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    },
                    {
                        individual: {
                            OR: [
                                {
                                    firstName: {
                                        contains: query,
                                        mode: 'insensitive'
                                    }
                                },
                                {
                                    lastName: {
                                        contains: query,
                                        mode: 'insensitive'
                                    }
                                },
                                {
                                    middleName: {
                                        contains: query,
                                        mode: 'insensitive'
                                    }
                                },
                                {
                                    emails: {
                                        some: {
                                            email: {
                                                contains: query,
                                                mode: 'insensitive'
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        });

        // const count = await prisma.$queryRaw<[{ count: number }]>`SELECT COUNT(*)
        //     FROM invoices
        //     JOIN customers ON invoices.customer_id = customers.id
        //     WHERE
        //     customers.name ILIKE ${`%${query}%`} OR
        //     customers.email ILIKE ${`%${query}%`} OR
        //     invoices.amount::text ILIKE ${`%${query}%`} OR // can realize in JS
        //     invoices.date::text ILIKE ${`%${query}%`} OR // can realize in JS
        //     invoices.status ILIKE ${`%${query}%`}`;

        console.log('-------------------------');
        console.log('Count: ', count);
        console.log('-------------------------');

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
    prevState: ICreateCustomerState,
    formData: FormData
): Promise<ICreateCustomerState> {
    console.log('Form data: ', formData);
    console.log('PrevState: ', prevState);
    const rawFormData = Object.fromEntries(formData ? formData.entries() : []);
    const dateISOString = new Date().toISOString();
    rawFormData.date = dateISOString;
    // Validate form using Zod
    const validatedForm = CreateCustomer.safeParse(rawFormData);
    if (!validatedForm.success) {
        return {
            errors: validatedForm.error.flatten().fieldErrors,
            message: 'Missing fields, failed to create customer'
        };
    }
    // Creating customer in DB
    try {
        console.log('Data: ', validatedForm.data);
        // await prisma.customers.create({ data });
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

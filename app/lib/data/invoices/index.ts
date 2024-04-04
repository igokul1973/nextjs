'use server';

import prisma from '@/app/lib/prisma';
import { InvoiceStatusEnum } from '@prisma/client';
import { unstable_noStore as noStore, revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { flattenCustomer } from '../../utils';
import { ICreateInvoiceState, TFetchInvoicePayload, fetchInvoiceSelect } from './types';

const ITEMS_PER_PAGE = 10;

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

export async function fetchLatestInvoices(): Promise<LatestInvoice[]> {
    try {
        noStore();

        // const invoices = await prisma.invoice.findMany({
        //     relationLoadStrategy: 'join',
        //     select: {
        //         id: true,
        //         amount: true,
        //         customer: {
        //             select: {
        //                 name: true,
        //                 image_url: true,
        //                 email: true
        //             }
        //         }
        //     },
        //     orderBy: {
        //         date: 'desc'
        //     },
        //     take: 5
        // });

        // const latestInvoices = invoices.map(
        //     ({ id, amount, customer: { name, image_url, email } }) => ({
        //         id,
        //         amount: formatCurrency(amount),
        //         name,
        //         image_url,
        //         email
        //     })
        // );

        // return latestInvoices;

        return [];
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch the latest invoices.');
    }
}

export async function fetchInvoiceById(
    id: string
): Promise<(TFetchInvoicePayload & { amount: number }) | null> {
    noStore();
    try {
        const invoice = await prisma.invoice.findFirst({
            relationLoadStrategy: 'query',
            select: fetchInvoiceSelect,
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
        throw new Error('Failed to fetch invoice.');
    }
}

export async function getFilteredInvoicesByAccountId(accountId: string, query: string) {
    noStore();

    try {
        const rawInvoices = await prisma.invoice.findMany({
            relationLoadStrategy: 'join',
            orderBy: {
                number: 'asc'
            },
            select: {
                id: true,
                date: true,
                status: true,
                number: true,
                createdByUser: true,
                customer: {
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
                        }
                    }
                },
                invoiceItems: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        quantity: true
                    }
                }
            },
            where: {
                AND: [
                    {
                        customer: {
                            organization: {
                                accountId: {
                                    equals: accountId
                                }
                            }
                        }
                    },
                    {
                        OR: [
                            {
                                createdByUser: {
                                    email: {
                                        contains: query
                                    }
                                }
                            },
                            {
                                status: {
                                    in: Object.values(InvoiceStatusEnum).filter((status) =>
                                        status.includes(query)
                                    )
                                }
                            },
                            {
                                customer: {
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
                                                    },
                                                    {
                                                        AND: [
                                                            {
                                                                firstName: {
                                                                    contains: query.split(' ')[0],
                                                                    mode: 'insensitive'
                                                                }
                                                            },
                                                            {
                                                                lastName: {
                                                                    contains: query.split(' ')[1],
                                                                    mode: 'insensitive'
                                                                }
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        AND: [
                                                            {
                                                                firstName: {
                                                                    contains: query.split(' ')[1],
                                                                    mode: 'insensitive'
                                                                }
                                                            },
                                                            {
                                                                lastName: {
                                                                    contains: query.split(' ')[0],
                                                                    mode: 'insensitive'
                                                                }
                                                            }
                                                        ]
                                                    }
                                                ]
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
        // Adding invoice amount
        const invoices = rawInvoices.map((invoice) => {
            const rawCustomer = { ...invoice.customer };
            const customer = flattenCustomer(rawCustomer);

            const amount = invoice.invoiceItems.reduce((acc, ii) => {
                return acc + ii.quantity * ii.price;
            }, 0);
            return { ...invoice, amount, customer, date: invoice.date.toLocaleDateString() };
        });

        return invoices;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch invoices.');
    }
}

export async function getFilteredInvoicesCount(query: string) {
    noStore();
    try {
        const status = Object.values(InvoiceStatusEnum).find((s) => s.includes(query));
        const count = await prisma.invoice.count({
            where: {
                OR: [
                    {
                        status: {
                            equals: status
                        }
                    },
                    {
                        customer: {
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
                            },
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
                    }
                ]
            }
        });

        return count;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch total number of invoices.');
    }
}

export async function deleteInvoiceById(id: string) {
    return prisma.invoice.delete({
        where: {
            id
        }
    });
}

export async function createInvoice(
    prevState: ICreateInvoiceState,
    formData: FormData
): Promise<ICreateInvoiceState> {
    console.log('Form data: ', formData);
    console.log('PrevState: ', prevState);
    const rawFormData = Object.fromEntries(formData ? formData.entries() : []);
    const dateISOString = new Date().toISOString();
    rawFormData.date = dateISOString;
    // Validate form using Zod
    const validatedForm = CreateInvoice.safeParse(rawFormData);
    if (!validatedForm.success) {
        return {
            errors: validatedForm.error.flatten().fieldErrors,
            message: 'Missing fields, failed to create invoice'
        };
    }
    // Creating invoice in DB
    try {
        console.log('Data: ', validatedForm.data);
        // await prisma.invoices.create({ data });
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

export async function updateInvoice(id: string, formData: FormData) {
    const rawFormData = Object.fromEntries(formData.entries());
    const dateISOString = new Date().toISOString();
    rawFormData.date = dateISOString;

    const data = UpdateInvoice.parse(rawFormData);

    // Creating invoice in DB
    try {
        await prisma.invoice.update({
            where: {
                id
            },
            data
        });
        console.log('Successfully updated invoice.');
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to delete invoice.');
    }
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string): Promise<{ message: string }> {
    if (!id) {
        throw Error('The id must be a valid UUID');
    }

    // Deleting invoice in DB
    try {
        await deleteInvoiceById(id);
        const successMessage = 'Successfully deleted invoice.';
        console.log(successMessage);

        revalidatePath('/dashboard/invoices');
        return { message: successMessage };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Database Error: failed to delete Invoice.');
    }
}

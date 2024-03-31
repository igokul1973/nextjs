import prisma from '@/app/lib/prisma';
import { InvoiceStatusEnum } from '@prisma/client';
import { unstable_noStore as noStore } from 'next/cache';
import { flattenCustomer } from '../../utils';
import { TFetchInvoicePayload, fetchInvoiceSelect } from './types';

const ITEMS_PER_PAGE = 6;

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

export async function fetchFilteredInvoices(query: string, currentPage: number) {
    noStore();

    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    try {
        const rawInvoices = await prisma.invoice.findMany({
            relationLoadStrategy: 'join',
            orderBy: {
                date: 'desc'
            },
            take: ITEMS_PER_PAGE,
            skip: offset,
            select: {
                id: true,
                date: true,
                status: true,
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
        });
        // Adding invoice amount
        const invoices = rawInvoices.map((invoice) => {
            const rawCustomer = { ...invoice.customer };
            const customer = flattenCustomer(rawCustomer);

            const amount = invoice.invoiceItems.reduce((acc, ii) => {
                return acc + ii.quantity * ii.price;
            }, 0);
            return { ...invoice, amount, customer };
        });

        // const invoices = await prisma.$queryRaw<Invoice[]>`
        //     SELECT
        //         invoices.id,
        //         invoices.amount,
        //         invoices.date,
        //         invoices.status,
        //         customers.name,
        //         customers.email,
        //         customers.image_url
        //     FROM invoices
        //     JOIN customers ON invoices.customer_id = customers.id
        //     WHERE
        //         customers.name ILIKE ${`%${query}%`} OR
        //         customers.email ILIKE ${`%${query}%`} OR
        //         invoices.amount::text ILIKE ${`%${query}%`} OR
        //         invoices.date::text ILIKE ${`%${query}%`} OR
        //         invoices.status ILIKE ${`%${query}%`}
        //     ORDER BY invoices.date DESC
        //     LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
        // `;

        return invoices;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch invoices.');
    }
}

export async function fetchFilteredInvoicesCount(query: string) {
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

        // const count = await prisma.$queryRaw<[{ count: number }]>`SELECT COUNT(*)
        //     FROM invoices
        //     JOIN customers ON invoices.customer_id = customers.id
        //     WHERE
        //     customers.name ILIKE ${`%${query}%`} OR
        //     customers.email ILIKE ${`%${query}%`} OR
        //     invoices.amount::text ILIKE ${`%${query}%`} OR
        //     invoices.date::text ILIKE ${`%${query}%`} OR
        //     invoices.status ILIKE ${`%${query}%`}`;

        console.log('-------------------------');
        console.log('Count: ', count);
        console.log('-------------------------');

        const totalPages = Math.ceil(Number(count) / ITEMS_PER_PAGE);
        return totalPages;
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

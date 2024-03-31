import prisma from '@/app/lib/prisma';
import { flattenCustomer, formatCurrency } from '@/app/lib/utils';
import { InvoiceStatusEnum } from '@prisma/client';
import { unstable_noStore as noStore } from 'next/cache';
import { fetchCustomersSelect } from './types';

const ITEMS_PER_PAGE = 6;

export async function fetchCustomers() {
    noStore();
    try {
        const customers = await prisma.customer.findMany({
            relationLoadStrategy: 'query',
            select: fetchCustomersSelect,
            orderBy: {
                individual: {
                    lastName: 'asc'
                },
                organization: {
                    name: 'asc'
                }
            }
        });

        return customers.map((c) => {
            return flattenCustomer(c);
        });
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch all customers.');
    }
}

export async function fetchFilteredCustomers(query: string, currentPage: number) {
    noStore();
    try {
        //     const data = await sql<CustomersTableType>`
        // 	SELECT
        // 	  customers.id,
        // 	  customers.name,
        // 	  customers.email,
        // 	  customers.image_url,
        // 	  COUNT(invoices.id) AS total_invoices,
        // 	  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
        // 	  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
        // 	FROM customers
        // 	LEFT JOIN invoices ON customers.id = invoices.customer_id
        // 	WHERE
        // 	  customers.name ILIKE ${`%${query}%`} OR
        //     customers.email ILIKE ${`%${query}%`}
        // 	GROUP BY customers.id, customers.name, customers.email, customers.image_url
        // 	ORDER BY customers.name ASC
        //   `;

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

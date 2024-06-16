import prisma from '@/app/lib/prisma';
import { IBaseDataFilterArgs } from '@/app/lib/types';
import { flattenCustomer, getInvoiceTotal } from '@/app/lib/utils';
import { AccountRelationEnum, InvoiceStatusEnum, Prisma } from '@prisma/client';
import { unstable_noStore as noStore } from 'next/cache';
import {
    TCustomerPayload,
    customerSelect,
    customerWithInvoicesSelect,
    getFilteredCustomersWhereClause
} from './types';

export async function getCustomerById(
    id: string,
    accountId: string,
    isSuperAdmin = false
): Promise<TCustomerPayload | null> {
    try {
        return await prisma.customer.findUnique({
            select: {
                ...customerSelect
            },
            where: {
                id,
                OR: !isSuperAdmin
                    ? [
                          {
                              organization: {
                                  is: {
                                      accountId: {
                                          equals: accountId
                                      }
                                  }
                              }
                          },
                          {
                              individual: {
                                  is: {
                                      accountId: {
                                          equals: accountId
                                      }
                                  }
                              }
                          }
                      ]
                    : undefined
            }
        });
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('could not fetch customer.');
    }
}

export async function getCustomersByAccountId(accountId: string) {
    noStore();
    try {
        const customers = await prisma.customer.findMany({
            relationLoadStrategy: 'query',
            select: customerSelect,
            where: {
                AND: [
                    {
                        OR: [
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
                                individual: {
                                    account: {
                                        id: {
                                            equals: accountId
                                        }
                                    }
                                }
                            }
                        ]
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
                return c1.customerName.localeCompare(c2.customerName);
            });
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('could not fetch all customers.');
    }
}

export async function getFilteredCustomersByAccountId({
    accountId,
    query,
    page = 0,
    itemsPerPage = 5,
    orderBy = 'name',
    order = 'asc',
    showOrg = true,
    showInd = true
}: IBaseDataFilterArgs & {
    showOrg?: boolean;
    showInd?: boolean;
}) {
    noStore();

    try {
        const offset = page * itemsPerPage;
        let orderByClause = { [orderBy]: order } as
            | Prisma.customerOrderByWithRelationInput
            | Prisma.customerOrderByWithRelationInput[];

        if (orderBy === 'name') {
            orderByClause = [
                {
                    organization: {
                        name: order
                    }
                },
                {
                    individual: {
                        lastName: order
                    }
                }
            ];
        }

        const whereClause = getFilteredCustomersWhereClause(query, accountId, showOrg, showInd);

        const rawCustomers = await prisma.customer.findMany({
            relationLoadStrategy: 'join',
            take: itemsPerPage,
            skip: offset,
            orderBy: orderByClause,
            select: customerWithInvoicesSelect,
            where: whereClause
        });

        // Preparing customer objejct
        const customers = rawCustomers.map((rawCustomer) => {
            const { invoices: rawInvoices, ...partialCustomer } = rawCustomer;
            const invoices = rawInvoices.map((rawInvoice) => {
                const { invoiceItems: rawInvoiceItemss, ...partialInvoice } = rawInvoice;
                const invoiceItems = rawInvoice.invoiceItems.map((ii) => {
                    return {
                        ...ii,
                        price: Number(ii.price)
                    };
                });
                return {
                    ...partialInvoice,
                    invoiceItems
                };
            });
            const { totalPending, totalPaid } = invoices.reduce(
                ({ totalPending, totalPaid }, i) => {
                    const invoiceTotal = getInvoiceTotal(i.invoiceItems);
                    if (i.status === InvoiceStatusEnum.pending) {
                        return { totalPending: totalPending + invoiceTotal, totalPaid };
                    } else if (i.status === InvoiceStatusEnum.paid) {
                        return { totalPending, totalPaid: totalPaid + invoiceTotal };
                    }
                    return { totalPending, totalPaid };
                },
                { totalPending: 0, totalPaid: 0 }
            );

            const customer = flattenCustomer(partialCustomer);

            return {
                ...customer,
                invoices,
                totalPending,
                totalPaid,
                totalInvoices: rawCustomer._count.invoices
            };
        });

        return customers;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('could not fetch customer table.');
    }
}

export async function getFilteredCustomersCountByAccountId(
    accountId: string,
    query: string,
    showOrg: boolean,
    showInd: boolean
) {
    noStore();
    try {
        return await prisma.customer.count({
            where: getFilteredCustomersWhereClause(query, accountId, showOrg, showInd)
        });
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('could not fetch customers count.');
    }
}

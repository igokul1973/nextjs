import prisma from '@/app/lib/prisma';
import { flattenCustomer } from '@/app/lib/utils';
import { AccountRelationEnum } from '@prisma/client';
import { unstable_noStore as noStore } from 'next/cache';
import { TCustomerPayload, customerSelect, getFilteredCustomersWhereClause } from './types';

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

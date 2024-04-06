import { AccountRelationEnum, Prisma } from '@prisma/client';

export const getCustomersSelect = {
    id: true,
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
    }
} satisfies Prisma.customerSelect;

export const getFilteredCustomersByAccountIdSelect = {
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
};

export type TGetCustomersPayload = Prisma.customerGetPayload<{
    select: typeof getCustomersSelect;
}>;

export interface ICreateCustomerState {
    message?: string | null;
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
        date?: string[];
    };
}
export const getFilteredCustomersWhereClause = (
    query: string,
    accountId: string
): Prisma.customerWhereInput => ({
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
});

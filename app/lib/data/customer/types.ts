import { AccountRelationEnum, Prisma } from '@prisma/client';

export const includeEntityRelations = {
    localIdentifierName: true,
    address: {
        include: {
            country: true
        }
    },
    emails: true,
    phones: true,
    customer: true
} satisfies Prisma.organizationInclude;

export const getCustomersSelect = {
    id: true,
    individual: {
        include: includeEntityRelations
    },
    organization: {
        include: {
            ...includeEntityRelations,
            type: true
        }
    }
} satisfies Prisma.customerSelect;

export const getCustomersWithInvoicesSelect = {
    id: true,
    individual: {
        include: includeEntityRelations
    },
    organization: {
        include: {
            ...includeEntityRelations,
            type: true
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
} satisfies Prisma.customerSelect;

export type TGetCustomerPayload = Prisma.customerGetPayload<{
    select: typeof getCustomersSelect;
}>;

export type TGetCustomerWithInvoicesPayload = Prisma.customerGetPayload<{
    select: typeof getCustomersWithInvoicesSelect;
}>;

export const getFilteredCustomersWhereClause = (
    query: string,
    accountId: string
): Prisma.customerWhereInput => ({
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
                            },
                            {
                                phones: {
                                    some: {
                                        countryCode: {
                                            contains: query,
                                            mode: 'insensitive'
                                        }
                                    }
                                }
                            },
                            {
                                phones: {
                                    some: {
                                        number: {
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
                                phones: {
                                    some: {
                                        countryCode: {
                                            contains: query,
                                            mode: 'insensitive'
                                        }
                                    }
                                }
                            },
                            {
                                phones: {
                                    some: {
                                        number: {
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

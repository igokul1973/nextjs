import { AccountRelationEnum, Prisma } from '@prisma/client';

export const organizationsSelect = {
    id: true,
    name: true,
    type: true,
    isPrivate: true,
    isCharity: true,
    localIdentifierNameId: true,
    localIdentifierName: true,
    localIdentifierValue: true,
    customerId: true,
    accountId: true,
    accountRelation: true,
    address: {
        include: {
            country: true
        }
    },
    phones: true,
    emails: true,
    attributes: true,
    createdBy: true,
    updatedBy: true
};

export const inidividualsSelect = {
    id: true,
    firstName: true,
    lastName: true,
    middleName: true,
    dob: true,
    description: true,
    localIdentifierNameId: true,
    localIdentifierName: true,
    localIdentifierValue: true,
    customerId: true,
    accountId: true,
    accountRelation: true,
    address: {
        include: {
            country: true
        }
    },
    phones: true,
    emails: true,
    attributes: true,
    createdBy: true,
    updatedBy: true
};

export const getCustomersSelect = {
    id: true,
    individual: {
        select: inidividualsSelect
    },
    organization: {
        select: organizationsSelect
    }
} satisfies Prisma.customerSelect;

export const getFilteredCustomersByAccountIdSelect = {
    id: true,
    organization: {
        select: organizationsSelect
    },
    individual: {
        select: inidividualsSelect
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

export type TGetCustomerPayload = Prisma.customerGetPayload<{
    select: typeof getCustomersSelect;
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

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
                    email: true,
                    type: true
                }
            },
            phones: {
                select: {
                    countryCode: true,
                    number: true
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
                    email: true,
                    type: true
                }
            },
            phones: {
                select: {
                    countryCode: true,
                    number: true
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
            },
            phones: {
                select: {
                    countryCode: true,
                    number: true
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
            },
            phones: {
                select: {
                    countryCode: true,
                    number: true
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

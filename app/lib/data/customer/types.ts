import { AccountRelationEnum, Prisma } from '@prisma/client';

export const includeEntityRelations = {
    logo: true,
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

export const customerSelect = {
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

export const customerWithInvoicesSelect = {
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

export type TCustomerPayload = Prisma.customerGetPayload<{
    select: typeof customerSelect;
}>;

export type TCustomerWithInvoicesPayload = Prisma.customerGetPayload<{
    select: typeof customerWithInvoicesSelect;
}>;

export const getFilteredCustomersWhereClause = (
    query: string,
    accountId: string,
    showOrg: boolean,
    showInd: boolean
): Prisma.customerWhereInput => {
    const whereClause: Prisma.customerWhereInput = {
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
    };

    if (showOrg && showInd) {
        (whereClause.AND as Prisma.customerWhereInput[]).push({
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
        });
    } else {
        if (showOrg) {
            (whereClause.AND as Prisma.customerWhereInput[]).push({
                organization: {
                    accountRelation: AccountRelationEnum.customer
                }
            });
        } else if (showInd) {
            (whereClause.AND as Prisma.customerWhereInput[]).push({
                individual: {
                    accountRelation: AccountRelationEnum.customer
                }
            });
        }
    }

    return whereClause;
};

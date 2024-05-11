import { InvoiceStatusEnum, Prisma } from '@prisma/client';
import { includeEntityRelations } from '../user/types';

export const getInvoiceSelect = {
    id: true,
    number: true,
    date: true,
    customerName: true,
    customerEmail: true,
    customerId: true,
    status: true,
    invoiceItems: {
        select: {
            id: true,
            price: true,
            quantity: true
        }
    }
} satisfies Prisma.invoiceSelect;

export type TGetInvoicePayloadRaw = Prisma.invoiceGetPayload<{ select: typeof getInvoiceSelect }>;

export type TGetInvoicePayload = Omit<TGetInvoicePayloadRaw, 'price'> & {
    price: number;
};

export interface ICreateInvoiceState {
    message?: string | null;
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
        date?: string[];
    };
}

export const invoicesInclude = {
    invoiceItems: true,
    createdByUser: true,
    customer: {
        include: {
            organization: {
                include: {
                    ...includeEntityRelations,
                    type: true
                }
            },
            individual: {
                include: includeEntityRelations
            }
        }
    }
} satisfies Prisma.invoiceInclude;

export type TGetInvoiceWithRelationsPayloadRaw = Prisma.invoiceGetPayload<{
    include: typeof invoicesInclude;
}>;

export const getQueryFilterWhereClause = (
    accountId: string,
    query: string
): Prisma.invoiceWhereInput => ({
    AND: [
        {
            OR: [
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
                    customer: {
                        individual: {
                            accountId: {
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
});

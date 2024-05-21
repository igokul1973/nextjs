'use server';

import {
    TEmail,
    TIndividualFormOutput,
    TIndividualFormOutputWithoutLogo,
    TPhone
} from '@/app/components/individuals/form/types';
import {
    TOrganizationFormOutput,
    TOrganizationFormOutputWithoutLogo
} from '@/app/components/organizations/form/types';
import prisma from '@/app/lib/prisma';
import { TDirtyFields, TOrder } from '@/app/lib/types';
import {
    flattenCustomer,
    getDirtyValues,
    getLogoCreateOrUpdate,
    validateEntityFormData
} from '@/app/lib/utils';
import {
    AccountRelationEnum,
    EmailTypeEnum,
    InvoiceStatusEnum,
    PhoneTypeEnum,
    Prisma
} from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { unstable_noStore as noStore, revalidatePath } from 'next/cache';
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
        throw new Error('Failed to fetch customer.');
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
        throw new Error('Failed to fetch all customers.');
    }
}

export async function getFilteredCustomersByAccountId(
    accountId: string,
    query: string,
    currentPage: number,
    itemsPerPage: number,
    showOrg: boolean = true,
    showInd: boolean = true,
    orderBy: string = 'name',
    order: TOrder = 'asc'
) {
    noStore();

    try {
        const offset = currentPage * itemsPerPage;
        let orderByClause = { [orderBy]: order } as
            | Prisma.customerOrderByWithRelationInput
            | Prisma.customerOrderByWithRelationInput[];

        switch (orderBy) {
            case 'name':
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
                break;
            default:
                break;
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
                    const invoiceTotal = i.invoiceItems.reduce((acc, ii) => {
                        return acc + ii.quantity * ii.price;
                    }, 0);
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
        throw new Error('Failed to fetch customer table.');
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
        throw new Error('Failed to fetch customers count.');
    }
}
export async function createIndividualCustomer(
    rawFormData: TIndividualFormOutput,
    userId: string,
    rawLogoFormData?: FormData
) {
    try {
        const validatedFormData = validateEntityFormData<TIndividualFormOutputWithoutLogo>(
            rawFormData,
            rawLogoFormData,
            true
        );

        if (!validatedFormData.success) {
            return null;
        }

        const validatedData = validatedFormData.data;

        const logoCreateOrUpdate = await getLogoCreateOrUpdate(validatedData, userId);

        const {
            logo,
            address,
            phones,
            emails,
            accountRelation,
            localIdentifierNameId,
            accountId,
            ...entity
        } = validatedData;

        let data: Prisma.customerCreateInput | null = null;

        const createIndividualObject: Prisma.individualCreateWithoutCustomerInput = {
            ...entity,
            logo: logoCreateOrUpdate,
            accountRelation: accountRelation as AccountRelationEnum,
            account: {
                connect: {
                    id: accountId
                }
            },
            localIdentifierName: {
                connect: {
                    id: localIdentifierNameId
                }
            },
            address: {
                create: address
            },
            phones: {
                create: phones as unknown as Omit<TPhone, 'type'> & {
                    type: PhoneTypeEnum;
                }
            },
            emails: {
                create: emails as unknown as Omit<TEmail, 'type'> & {
                    type: EmailTypeEnum;
                }
            }
        };

        data = {
            individual: {
                create: createIndividualObject
            }
        };

        if (!data) {
            throw new Error('Failed to create customer.');
        }

        const newCustomer = await prisma.customer.create({
            data,
            select: {
                id: true,
                isActive: true,
                organization: true,
                individual: true
            }
        });

        console.log('Successfully created new individual customer: ', newCustomer);

        revalidatePath('/dashboard/customers');
        return newCustomer;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Database Error: Failed to create individual customer.');
    }
}

export async function createOrganizationCustomer(
    rawFormData: TOrganizationFormOutputWithoutLogo,
    userId: string,
    rawLogoFormData?: FormData
) {
    try {
        const validatedFormData = validateEntityFormData<TOrganizationFormOutputWithoutLogo>(
            rawFormData,
            rawLogoFormData,
            false
        );

        if (!validatedFormData.success) {
            return null;
        }

        const validatedData = validatedFormData.data;

        const logoCreateOrUpdate = await getLogoCreateOrUpdate(validatedData, userId);

        const {
            logo,
            typeId,
            address,
            phones,
            emails,
            accountRelation,
            localIdentifierNameId,
            accountId,
            ...entity
        } = validatedData;

        let data: Prisma.customerCreateInput | null = null;

        const createEntityObject = {
            ...entity,
            logo: logoCreateOrUpdate,
            type: {
                connect: {
                    id: typeId
                }
            },
            accountRelation: accountRelation as AccountRelationEnum,
            account: {
                connect: {
                    id: accountId
                }
            },
            localIdentifierName: {
                connect: {
                    id: localIdentifierNameId
                }
            },
            address: {
                create: address
            },
            phones: {
                create: phones as unknown as Omit<TPhone, 'type'> & {
                    type: PhoneTypeEnum;
                }
            },
            emails: {
                create: emails as unknown as Omit<TEmail, 'type'> & {
                    type: EmailTypeEnum;
                }
            }
        };

        data = {
            organization: {
                create: createEntityObject
            }
        };

        if (!data) {
            throw new Error('Failed to create customer.');
        }

        const newCustomer = await prisma.customer.create({
            data,
            include: {
                organization: {
                    include: {
                        logo: true
                    }
                },
                individual: {
                    include: {
                        logo: true
                    }
                }
            }
        });

        console.log('Successfully created new organization customer: ', newCustomer);

        revalidatePath('/dashboard/customers');
        return newCustomer;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('database error: failed to create customer.');
    }
}

export async function updateIndividualCustomer(
    rawFormData: TIndividualFormOutputWithoutLogo,
    dirtyFields: TDirtyFields<TIndividualFormOutput>,
    userId: string,
    rawLogoFormData?: FormData
) {
    try {
        const validatedFormData = validateEntityFormData<TIndividualFormOutputWithoutLogo>(
            rawFormData,
            rawLogoFormData,
            true
        );

        if (!validatedFormData.success) {
            return null;
        }

        const validatedData = validatedFormData.data;

        const changedFields = getDirtyValues<TIndividualFormOutput>(dirtyFields, validatedData);

        if (!changedFields) {
            return null;
        }

        const logoCreateOrUpdate = await getLogoCreateOrUpdate(changedFields, userId);

        console.log(logoCreateOrUpdate);

        const customerId = validatedData.customerId;

        const {
            id,
            address,
            phones,
            emails,
            accountId,
            localIdentifierNameId,
            accountRelation,
            ...entity
        } = changedFields;

        const { countryId, ...addressWithoutCountryId } = address || {};

        const emailsWithoutIds = emails?.map((e) => {
            const { id, ...email } = e;
            return email;
        });

        const phonesWithoutIds = phones?.map((p) => {
            const { id, ...phone } = p;
            return phone;
        });

        const data: Prisma.customerUpdateInput = {
            individual: {
                update: {
                    data: {
                        ...entity,
                        logo: logoCreateOrUpdate,
                        address: address
                            ? {
                                  update: {
                                      data: {
                                          ...addressWithoutCountryId,
                                          updatedBy: userId,
                                          country: countryId
                                              ? {
                                                    connect: {
                                                        id: countryId
                                                    }
                                                }
                                              : undefined
                                      }
                                  }
                              }
                            : undefined,
                        updatedBy: userId,
                        emails: emailsWithoutIds
                            ? {
                                  deleteMany: {
                                      individualId: validatedData.id
                                  },
                                  createMany: {
                                      data: emailsWithoutIds?.map((e) => ({
                                          ...e,
                                          updatedBy: userId
                                      })) as unknown as (Omit<TEmail, 'type'> & {
                                          type: EmailTypeEnum;
                                      })[]
                                  }
                              }
                            : undefined,
                        phones: phonesWithoutIds
                            ? {
                                  deleteMany: {
                                      individualId: validatedData.id
                                  },
                                  createMany: {
                                      data: phonesWithoutIds?.map((p) => ({
                                          ...p,
                                          updatedBy: userId
                                      })) as unknown as (Omit<TPhone, 'type'> & {
                                          type: PhoneTypeEnum;
                                      })[]
                                  }
                              }
                            : undefined
                    }
                }
            }
        };

        const updatedCustomer = await prisma.customer.update({
            where: {
                id: customerId
            },
            data,
            include: {
                individual: {
                    include: {
                        address: true,
                        phones: true,
                        emails: true
                    }
                }
            }
        });

        console.log('Successfully updated customer with ID:', updatedCustomer.id);

        revalidatePath('/dashboard/customers');
        return updatedCustomer;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('database error: failed to update customer');
    }
}

export async function updateOrganizationCustomer(
    rawFormData: TOrganizationFormOutputWithoutLogo,
    dirtyFields: TDirtyFields<TOrganizationFormOutput>,
    userId: string,
    rawLogoFormData?: FormData
) {
    try {
        const validatedFormData = validateEntityFormData<TOrganizationFormOutputWithoutLogo>(
            rawFormData,
            rawLogoFormData,
            false
        );

        if (!validatedFormData.success) {
            return null;
        }

        const validatedData = validatedFormData.data;

        const changedFields = getDirtyValues<TOrganizationFormOutput>(dirtyFields, validatedData);

        if (!changedFields) {
            return null;
        }

        const logoCreateOrUpdate = await getLogoCreateOrUpdate(changedFields, userId);

        const customerId = validatedData.customerId;

        const {
            id,
            address,
            phones,
            emails,
            accountId,
            localIdentifierNameId,
            accountRelation,
            ...entity
        } = changedFields;

        const { countryId, ...addressWithoutCountryId } = address || {};

        const emailsWithoutIds = emails?.map((e) => {
            const { id, ...email } = e;
            return email;
        });

        const phonesWithoutIds = phones?.map((p) => {
            const { id, ...phone } = p;
            return phone;
        });

        const { typeId, ...rest } = entity;
        const entityWithoutTypeId = rest;

        const data: Prisma.customerUpdateInput = {
            organization: {
                update: {
                    data: {
                        ...entityWithoutTypeId,
                        type: typeId
                            ? {
                                  connect: {
                                      id: typeId
                                  }
                              }
                            : undefined,
                        logo: logoCreateOrUpdate,
                        address: address
                            ? {
                                  update: {
                                      data: {
                                          ...addressWithoutCountryId,
                                          updatedBy: userId,
                                          country: !!countryId
                                              ? {
                                                    connect: {
                                                        id: countryId
                                                    }
                                                }
                                              : undefined
                                      }
                                  }
                              }
                            : undefined,
                        updatedBy: userId,
                        emails: emailsWithoutIds
                            ? {
                                  deleteMany: {
                                      organizationId: validatedData.id
                                  },
                                  createMany: {
                                      data: emailsWithoutIds?.map((e) => ({
                                          ...e,
                                          updatedBy: userId
                                      })) as unknown as (Omit<TEmail, 'type'> & {
                                          type: EmailTypeEnum;
                                      })[]
                                  }
                              }
                            : undefined,
                        phones: phonesWithoutIds
                            ? {
                                  deleteMany: {
                                      organizationId: validatedData.id
                                  },
                                  createMany: {
                                      data: phonesWithoutIds?.map((p) => ({
                                          ...p,
                                          updatedBy: userId
                                      })) as unknown as (Omit<TPhone, 'type'> & {
                                          type: PhoneTypeEnum;
                                      })[]
                                  }
                              }
                            : undefined
                    }
                }
            }
        };

        const updatedCustomer = await prisma.customer.update({
            where: {
                id: customerId
            },
            data,
            include: {
                organization: {
                    include: {
                        address: true,
                        phones: true,
                        emails: true
                    }
                }
            }
        });

        console.log('Successfully updated customer with ID:', updatedCustomer.id);

        revalidatePath('/dashboard/customers');
        return updatedCustomer;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('database error: failed to update customer');
    }
}

export async function deleteCustomerById(id: string): Promise<void> {
    if (!id) {
        throw Error('The id must be a valid UUID');
    }

    // Creating customer in DB
    try {
        await prisma.customer.delete({
            where: {
                id
            }
        });

        console.log(`Successfully deleted customer with ID #${id}`);

        revalidatePath('/dashboard/customers');
    } catch (error: unknown) {
        console.error('Database Error:', error);
        if (
            error instanceof PrismaClientKnownRequestError &&
            error.message.toLocaleLowerCase().includes('foreign key constraint') &&
            error.message.toLocaleLowerCase().includes('invoices')
        ) {
            throw new Error('cannot delete customer because it has associated invoices');
        }
        throw new Error('database error: failed to delete customer');
    }
}

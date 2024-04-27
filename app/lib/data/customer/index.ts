'use server';

import { TEmail, TIndividualForm, TPhone } from '@/app/components/individuals/create-form/types';
import { TOrganizationForm } from '@/app/components/organizations/create-form/types';
import prisma from '@/app/lib/prisma';
import { TDirtyFields, TOrder } from '@/app/lib/types';
import { flattenCustomer, formatCurrency, getDirtyValues } from '@/app/lib/utils';
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
    TGetCustomerPayload,
    getCustomersSelect,
    getCustomersWithInvoicesSelect,
    getFilteredCustomersWhereClause
} from './types';

export async function getCustomerById(id: string): Promise<TGetCustomerPayload | null> {
    try {
        return await prisma.customer.findUnique({
            select: {
                ...getCustomersSelect
            },
            where: {
                id
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
            select: getCustomersSelect,
            where: {
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
                    }
                ]
            }
        });

        return customers
            .map((c) => {
                return flattenCustomer(c);
            })
            .sort((c1, c2) => {
                return c1.name.localeCompare(c2.name);
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
    showOrg: boolean,
    showInd: boolean,
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
            select: getCustomersWithInvoicesSelect,
            where: whereClause
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

export async function createCustomer(formData: TIndividualForm | TOrganizationForm) {
    try {
        const {
            address,
            phones,
            emails,
            accountRelation,
            localIdentifierNameId,
            accountId,
            ...entity
        } = formData;

        let data: Prisma.XOR<
            Prisma.customerCreateInput,
            Prisma.customerUncheckedCreateInput
        > | null = null;

        const createEntityObject = {
            ...entity,
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
        if ('typeId' in createEntityObject) {
            const { typeId, ...createEntityObjectWithoutType } = createEntityObject;

            const createEntityObjectWithType = {
                ...createEntityObjectWithoutType,
                type: {
                    connect: {
                        id: typeId
                    }
                }
            };

            data = {
                organization: {
                    create: createEntityObjectWithType
                }
            };
        } else if ('firstName' in createEntityObject) {
            data = {
                individual: {
                    create: createEntityObject
                }
            };
        }

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

        console.log('Successfully created new customer: ', newCustomer);

        revalidatePath('/dashboard/customers');
        return newCustomer;
    } catch (error) {
        console.error('Database Error:', error);
        throw error;
    }
}

export async function updateCustomer(
    formData: TIndividualForm | TOrganizationForm,
    dirtyFields: TDirtyFields<TIndividualForm | TOrganizationForm>,
    userId: string
) {
    try {
        const diff = getDirtyValues<TIndividualForm | TOrganizationForm>(dirtyFields, formData);
        const isIndividual = 'firstName' in formData;
        const customerId = formData.customerId;

        if (!diff) {
            return null;
        }

        const {
            id,
            address,
            phones,
            emails,
            accountId,
            localIdentifierNameId,
            accountRelation,
            ...entity
        } = diff;

        const { countryId, ...addressWithoutCountryId } = address || {};

        const emailsWithoutIds = emails?.map((e) => {
            const { id, ...email } = e;
            return email;
        });

        const phonesWithoutIds = phones?.map((p) => {
            const { id, ...phone } = p;
            return phone;
        });

        let entityWithoutTypeId = null;

        if (!isIndividual && 'typeId' in entity) {
            const { typeId, ...rest } = entity;
            entityWithoutTypeId = rest;
        }

        const data = !isIndividual
            ? {
                  organization: {
                      update: {
                          data: {
                              ...entityWithoutTypeId,
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
                              emails: emailsWithoutIds && {
                                  deleteMany: {
                                      organizationId: formData.id
                                  },
                                  createMany: {
                                      data: emailsWithoutIds?.map((e) => ({
                                          ...e,
                                          updatedBy: userId
                                      })) as unknown as (Omit<TEmail, 'type'> & {
                                          type: EmailTypeEnum;
                                      })[]
                                  }
                              },
                              phones: phonesWithoutIds && {
                                  deleteMany: {
                                      organizationId: formData.id
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
                          }
                      }
                  }
              }
            : {
                  individual: {
                      update: {
                          data: {
                              ...entity,
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
                              emails: emailsWithoutIds && {
                                  deleteMany: {
                                      individualId: formData.id
                                  },
                                  createMany: {
                                      data: emailsWithoutIds?.map((e) => ({
                                          ...e,
                                          updatedBy: userId
                                      })) as unknown as (Omit<TEmail, 'type'> & {
                                          type: EmailTypeEnum;
                                      })[]
                                  }
                              },
                              phones: phonesWithoutIds && {
                                  deleteMany: {
                                      individualId: formData.id
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
                          }
                      }
                  }
              };

        const updatedCustomer = await prisma.customer.update({
            where: {
                id: customerId
            },
            data
        });

        console.log('Successfully updated customer with ID:', updatedCustomer.id);

        revalidatePath('/dashboard/customers');
        return updatedCustomer;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to update customer');
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
            throw new Error('Cannot delete customer because it has associated invoices.');
        }
        throw new Error('Database Error: failed to delete Customer.');
    }
}

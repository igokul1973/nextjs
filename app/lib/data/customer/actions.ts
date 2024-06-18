'use server';

import {
    TCustomerIndFormOutput,
    TCustomerIndFormOutputWithoutLogo,
    TEmail,
    TPhone
} from '@/app/components/individuals/form/types';
import {
    TCustomerOrgFormOutput,
    TCustomerOrgFormOutputWithoutLogo
} from '@/app/components/organizations/form/types';
import prisma from '@/app/lib/prisma';
import { TDirtyFields } from '@/app/lib/types';
import {
    getDirtyValues,
    getLogoCreateOrUpdate,
    getUser,
    validateEntityFormData
} from '@/app/lib/utils';
import { getI18n } from '@/locales/server';
import { AccountRelationEnum, EmailTypeEnum, PhoneTypeEnum, Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { revalidatePath } from 'next/cache';

export async function createIndividualCustomer(
    rawFormData: TCustomerIndFormOutput,
    rawLogoFormData?: FormData
) {
    const t = await getI18n();
    try {
        const { user, account } = await getUser();
        const userId = user.id;
        const validatedFormData = validateEntityFormData<TCustomerIndFormOutputWithoutLogo>(
            t,
            rawFormData,
            rawLogoFormData,
            true,
            true
        );

        if (!validatedFormData.success) {
            return null;
        }

        const validatedData = validatedFormData.data;

        const {
            code,
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
            // logo: logoCreateOrUpdate,
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
            code,
            individual: {
                create: createIndividualObject
            }
        };

        if (!data) {
            throw new Error('could not create customer.');
        }

        const newCustomer = await prisma.customer.create({
            data,
            select: {
                id: true,
                isActive: true,
                individual: true
            }
        });

        const logoCreateOrUpdate = await getLogoCreateOrUpdate(
            validatedData.logo,
            userId,
            account.id,
            newCustomer.individual!.id,
            false
        );

        if (logoCreateOrUpdate) {
            await prisma.individual.update({
                data: {
                    logo: logoCreateOrUpdate
                },
                where: {
                    id: newCustomer.individual!.id
                },
                select: {
                    id: true
                }
            });
        }

        console.log('Successfully created new individual customer: ', newCustomer);

        revalidatePath('/dashboard/customers');
        return newCustomer;
    } catch (error) {
        console.error('Error:', error);
        throw new Error(t('could not create customer'));
    }
}

export async function createOrganizationCustomer(
    rawFormData: TCustomerOrgFormOutputWithoutLogo,
    rawLogoFormData?: FormData
) {
    const t = await getI18n();
    try {
        const { user, account } = await getUser();
        const userId = user.id;
        const validatedFormData = validateEntityFormData<TCustomerOrgFormOutputWithoutLogo>(
            t,
            rawFormData,
            rawLogoFormData,
            false,
            true
        );

        if (!validatedFormData.success) {
            return null;
        }

        const validatedData = validatedFormData.data;

        const {
            code,
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
            code,
            organization: {
                create: createEntityObject
            }
        };

        if (!data) {
            throw new Error('could not create customer.');
        }

        const newCustomer = await prisma.customer.create({
            data,
            select: {
                id: true,
                isActive: true,
                organization: true
            }
        });

        const logoCreateOrUpdate = await getLogoCreateOrUpdate(
            validatedData.logo,
            userId,
            account.id,
            newCustomer.organization!.id,
            false
        );

        if (logoCreateOrUpdate) {
            await prisma.organization.update({
                data: {
                    logo: logoCreateOrUpdate
                },
                where: {
                    id: newCustomer.organization!.id
                },
                select: {
                    id: true
                }
            });
        }

        console.log('Successfully created new organization customer: ', newCustomer);

        revalidatePath('/dashboard/customers');
        return newCustomer;
    } catch (error) {
        console.error('Error:', error);
        throw new Error(t('could not create customer'));
    }
}
export async function updateIndividualCustomer(
    rawFormData: TCustomerIndFormOutputWithoutLogo,
    dirtyFields: TDirtyFields<TCustomerIndFormOutput>,
    oldLogoName?: string,
    rawLogoFormData?: FormData
) {
    const t = await getI18n();
    try {
        const { user, account } = await getUser();
        const userId = user.id;
        const validatedFormData = validateEntityFormData<TCustomerIndFormOutputWithoutLogo>(
            t,
            rawFormData,
            rawLogoFormData,
            true,
            true
        );

        if (!validatedFormData.success) {
            throw Error('Form is invalid');
        }

        const validatedData = validatedFormData.data;

        const changedFields = getDirtyValues<TCustomerIndFormOutput>(dirtyFields, validatedData);

        if (!changedFields) {
            throw Error('No changes detected');
        }

        const logoCreateOrUpdate = await getLogoCreateOrUpdate(
            changedFields.logo,
            userId,
            account.id,
            validatedData.id,
            true,
            oldLogoName
        );

        const customerId = validatedData.customerId;

        const {
            id,
            code,
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
            code,
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
        throw new Error(t('could not update customer'));
    }
}
export async function updateOrganizationCustomer(
    rawFormData: TCustomerOrgFormOutputWithoutLogo,
    dirtyFields: TDirtyFields<TCustomerOrgFormOutput>,
    oldLogoName?: string,
    rawLogoFormData?: FormData
) {
    const t = await getI18n();
    try {
        const { user, account } = await getUser();
        const userId = user.id;
        const validatedFormData = validateEntityFormData<TCustomerOrgFormOutputWithoutLogo>(
            t,
            rawFormData,
            rawLogoFormData,
            false,
            true
        );

        if (!validatedFormData.success) {
            throw Error('Form is invalid');
        }

        const validatedData = validatedFormData.data;

        const changedFields = getDirtyValues<TCustomerOrgFormOutput>(dirtyFields, validatedData);

        if (!changedFields) {
            throw Error('No changes detected');
        }

        const logoCreateOrUpdate = await getLogoCreateOrUpdate(
            changedFields.logo,
            userId,
            account.id,
            validatedData.id,
            true,
            oldLogoName
        );

        const customerId = validatedData.customerId;

        const {
            id,
            code,
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
            code,
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
        throw new Error(t('could not update customer'));
    }
}
export async function deleteCustomerById(id: string): Promise<void> {
    const t = await getI18n();
    // Creating customer in DB
    try {
        if (!id) {
            throw Error('The id must be a valid UUID');
        }

        await prisma.customer.delete({
            where: {
                id
            }
        });

        console.log(`Successfully deleted customer with ID #${id}`);

        revalidatePath('/dashboard/customers');
    } catch (error: unknown) {
        console.error('Error:', error);
        if (
            error instanceof PrismaClientKnownRequestError &&
            error.message.toLocaleLowerCase().includes('foreign key constraint') &&
            error.message.toLocaleLowerCase().includes('invoices')
        ) {
            throw new Error(t('cannot delete customer because it has associated invoices'));
        }
        throw new Error(t('could not delete customer'));
    }
}

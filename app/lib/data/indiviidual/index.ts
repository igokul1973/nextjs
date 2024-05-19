import {
    TEmail,
    TIndividualFormOutput,
    TIndividualFormOutputWithoutLogo,
    TPhone
} from '@/app/components/individuals/form/types';
import prisma from '@/app/lib/prisma';
import { getDirtyValues, getLogoCreateOrUpdate, validateEntityFormData } from '@/app/lib/utils';
import { AccountRelationEnum, EmailTypeEnum, PhoneTypeEnum, Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { TDirtyFields } from '../../types';
import { TIndividualPayload, includeIndividualRelations } from './types';

export async function getIndividualById(
    id: string,
    accountId: string,
    isSuperAdmin = false
): Promise<TIndividualPayload | null> {
    try {
        return await prisma.individual.findUnique({
            include: includeIndividualRelations,
            where: {
                id,
                accountId: !isSuperAdmin ? { equals: accountId } : undefined
            }
        });
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch individual.');
    }
}

export async function createIndividual(
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
            address,
            phones,
            emails,
            accountRelation,
            localIdentifierNameId,
            accountId,
            ...entity
        } = validatedData;

        let data: Prisma.individualCreateInput | null = null;

        const createEntityObject = {
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

        data = createEntityObject;

        if (!data) {
            throw new Error('Failed to create customer.');
        }

        const newOrg = await prisma.individual.create({
            data
        });

        console.log('Successfully created new individual: ', newOrg);

        revalidatePath('/dashboard/customers');
        return newOrg;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Database Error: Failed to create individual customer.');
    }
}

export async function updateIndividual(
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

        const data: Prisma.individualUpdateInput = {
            ...entity,
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
            emails: emailsWithoutIds && {
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
            },
            phones: phonesWithoutIds && {
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
        };

        const updatedCustomer = await prisma.individual.update({
            where: {
                id: customerId
            },
            data,
            include: {
                address: true,
                phones: true,
                emails: true,
                logo: true
            }
        });

        console.log('Successfully updated customer with ID:', updatedCustomer.id);

        revalidatePath('/dashboard/customers');
        return updatedCustomer;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to update customer');
    }
}

'use server';

import {
    TEmail,
    TIndividualFormOutput,
    TIndividualFormOutputWithoutLogo,
    TPhone
} from '@/app/components/individuals/form/types';
import prisma from '@/app/lib/prisma';
import { TDirtyFields } from '@/app/lib/types';
import { getDirtyValues, getLogoCreateOrUpdate, validateEntityFormData } from '@/app/lib/utils';
import { AccountRelationEnum, EmailTypeEnum, PhoneTypeEnum, Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

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

        const logoCreateOrUpdate = await getLogoCreateOrUpdate(validatedData.logo, userId, false);

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
            throw new Error('failed to create provider');
        }

        const newOrg = await prisma.individual.create({
            data
        });

        console.log('Successfully created new individual: ', newOrg);

        revalidatePath('/dashboard/customers');
        return newOrg;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('database error: failed to create provider');
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

        const logoCreateOrUpdate = await getLogoCreateOrUpdate(changedFields.logo, userId, true);

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
        };

        const updatedIndividual = await prisma.individual.update({
            where: {
                id: rawFormData.id
            },
            data,
            include: {
                address: true,
                phones: true,
                emails: true
            }
        });

        console.log('Successfully updated individual with ID:', updatedIndividual.id);

        revalidatePath('/dashboard/customers');
        return updatedIndividual;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('database error: failed to update provider');
    }
}

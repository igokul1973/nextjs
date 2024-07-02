'use server';

import {
    TEmail,
    TPhone,
    TProviderIndFormOutput,
    TProviderIndFormOutputWithoutLogo
} from '@/app/components/individuals/form/types';
import prisma from '@/app/lib/prisma';
import { TDirtyFields } from '@/app/lib/types';
import {
    getApp,
    getDirtyValues,
    getLogoCreateOrUpdate,
    getPartialApp,
    validateEntityFormData
} from '@/app/lib/utils';
import { getI18n } from '@/locales/server';
import { AccountRelationEnum, EmailTypeEnum, PhoneTypeEnum, Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { includeIndividualRelations } from './types';

export async function createIndividual(
    rawFormData: TProviderIndFormOutput,
    rawLogoFormData?: FormData
) {
    const t = await getI18n();
    const { user, account } = await getPartialApp();
    const userId = user?.id;

    if (!account || !userId) {
        throw new Error('Could not find user or account');
    }

    try {
        const validatedFormData = validateEntityFormData<TProviderIndFormOutputWithoutLogo>(
            t,
            rawFormData,
            rawLogoFormData,
            true,
            false
        );

        if (!validatedFormData.success) {
            throw Error('Form is invalid');
        }

        const validatedData = validatedFormData.data;

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

        let data: Prisma.individualCreateInput | null = null;

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

        data = createEntityObject;

        if (!data) {
            throw new Error('could not create provider');
        }

        const createdIndividual = await prisma.individual.create({
            data,
            include: includeIndividualRelations
        });

        const logoCreateOrUpdate = await getLogoCreateOrUpdate(
            logo,
            userId,
            account.id,
            createdIndividual.id,
            false
        );

        let updatedIndividual = null;

        if (logoCreateOrUpdate) {
            updatedIndividual = await prisma.individual.update({
                data: {
                    logo: logoCreateOrUpdate
                },
                where: {
                    id: createdIndividual.id
                },
                include: includeIndividualRelations
            });
        }

        console.log('Successfully created new individual: ', createdIndividual);
        revalidatePath('/', 'layout');
        return updatedIndividual ?? createdIndividual;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('could not create provider');
    }
}
export async function updateIndividual(
    rawFormData: TProviderIndFormOutputWithoutLogo,
    dirtyFields: TDirtyFields<TProviderIndFormOutput>,
    oldLogoName?: string,
    rawLogoFormData?: FormData
) {
    const t = await getI18n();
    const { user, account } = await getApp();
    try {
        const userId = user.id;

        const validatedFormData = validateEntityFormData<TProviderIndFormOutputWithoutLogo>(
            t,
            rawFormData,
            rawLogoFormData,
            true,
            false
        );

        if (!validatedFormData.success) {
            throw Error('Form is invalid');
        }

        const validatedData = validatedFormData.data;

        const changedFields = getDirtyValues<TProviderIndFormOutput>(dirtyFields, validatedData);

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
            include: includeIndividualRelations
        });

        console.log('Successfully updated individual with ID:', updatedIndividual.id);

        revalidatePath('/', 'layout');
        return updatedIndividual;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('could not update provider');
    }
}

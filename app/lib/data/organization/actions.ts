'use server';

import { TEmail, TPhone } from '@/app/components/individuals/form/types';
import {
    TProviderOrgFormOutput,
    TProviderOrgFormOutputWithoutLogo
} from '@/app/components/organizations/form/types';
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
import { includeOrganizationRelations } from './types';

export async function createOrganization(
    rawFormData: TProviderOrgFormOutputWithoutLogo,
    rawLogoFormData?: FormData
) {
    const t = await getI18n();
    const { user, account } = await getPartialApp();
    const userId = user?.id;

    if (!account || !userId) {
        throw new Error('Could not find user or account');
    }

    try {
        const validatedFormData = validateEntityFormData<TProviderOrgFormOutputWithoutLogo>(
            t,
            rawFormData,
            rawLogoFormData,
            false,
            false
        );

        if (!validatedFormData.success) {
            throw Error('Form is invalid');
        }

        const validatedData = validatedFormData.data;
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

        const data: Prisma.organizationCreateInput = {
            ...entity,
            type: typeId
                ? {
                      connect: {
                          id: typeId
                      }
                  }
                : undefined,
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

        const createdOrganization = await prisma.organization.create({
            data,
            include: includeOrganizationRelations
        });

        const logoCreateOrUpdate = await getLogoCreateOrUpdate(
            logo,
            userId,
            account.id,
            createdOrganization.id,
            false
        );

        if (logoCreateOrUpdate) {
            await prisma.organization.update({
                data: {
                    logo: logoCreateOrUpdate
                },
                where: {
                    id: createdOrganization.id
                },
                select: {
                    id: true
                }
            });
        }

        console.log('Successfully created new organization: ', createdOrganization);

        revalidatePath('/', 'layout');
        return createdOrganization;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('could not create provider');
    }
}
export async function updateOrganization(
    rawFormData: TProviderOrgFormOutputWithoutLogo,
    dirtyFields: TDirtyFields<TProviderOrgFormOutput>,
    oldLogoName?: string,
    rawLogoFormData?: FormData
) {
    const t = await getI18n();
    const { user, account } = await getApp();
    try {
        const userId = user.id;

        const validatedFormData = validateEntityFormData<TProviderOrgFormOutputWithoutLogo>(
            t,
            rawFormData,
            rawLogoFormData,
            false,
            false
        );

        if (!validatedFormData.success) {
            throw Error('Form is invalid');
        }

        const validatedData = validatedFormData.data;

        const changedFields = getDirtyValues<TProviderOrgFormOutput>(dirtyFields, validatedData);

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

        const { typeId, ...rest } = entity;
        const entityWithoutTypeId = rest;

        const data: Prisma.organizationUpdateInput = {
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
        };

        const updatedOrganization = await prisma.organization.update({
            where: {
                id: rawFormData.id
            },
            data,
            include: includeOrganizationRelations
        });

        console.log('Successfully updated organization with ID:', updatedOrganization.id);

        revalidatePath('/', 'layout');
        return updatedOrganization;
    } catch (error) {
        console.error('Error:', error);
        throw new Error(t('could not update provider'));
    }
}

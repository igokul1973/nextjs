'use server';

import { TEmail, TPhone } from '@/app/components/individuals/form/types';
import {
    TOrganizationFormOutput,
    TOrganizationFormOutputWithoutLogo
} from '@/app/components/organizations/form/types';
import prisma from '@/app/lib/prisma';
import { getDirtyValues, getLogoCreateOrUpdate, validateEntityFormData } from '@/app/lib/utils';
import { AccountRelationEnum, EmailTypeEnum, PhoneTypeEnum, Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { TDirtyFields } from '../../types';
import { TOrganizationPayload, includeOrganizationRelations } from './types';

export async function getOrganizationById(
    id: string,
    accountId: string,
    isSuperAdmin = false
): Promise<TOrganizationPayload | null> {
    try {
        return await prisma.organization.findUnique({
            include: includeOrganizationRelations,
            where: {
                id,
                accountId: !isSuperAdmin ? { equals: accountId } : undefined
            }
        });
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch organization.');
    }
}

export async function createOrganization(
    rawFormData: TOrganizationFormOutputWithoutLogo,
    userId: string,
    rawLogoFormData?: FormData
) {
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

    try {
        const {
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

        const newOrg = await prisma.organization.create({
            data
        });

        console.log('Successfully created new organization: ', newOrg);

        revalidatePath('/dashboard/customers');
        return newOrg;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('database error: failed to create provider');
    }
}

export async function updateOrganization(
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
        };

        const updatedOrganization = await prisma.organization.update({
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

        console.log('Successfully updated organization with ID:', updatedOrganization.id);

        revalidatePath('/dashboard/customers');
        return updatedOrganization;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('database error: failed to update provider');
    }
}

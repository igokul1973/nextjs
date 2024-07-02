import {
    attributesInitial,
    getEmailsInitial,
    getPhonesInitial
} from '@/app/[locale]/dashboard/customers/utils';
import { AccountRelationEnum } from '@prisma/client';
import { TCustomerIndForm, TProviderIndForm } from './form/types';

export const getProviderIndDefaultFormValues = (
    accountId: string,
    userId: string,
    countryId: string,
    localIdentifierNameId: string
): TProviderIndForm => {
    return {
        id: '',
        accountRelation: AccountRelationEnum.provider,
        accountId: accountId,
        logo: null,
        firstName: '',
        lastName: '',
        middleName: '',
        localIdentifierNameId,
        localIdentifierValue: '',
        dob: null,
        description: '',
        address: {
            id: '',
            addressLine1: '',
            addressLine2: null,
            addressLine3: null,
            locality: '',
            region: null,
            postcode: '',
            countryId,
            createdBy: userId,
            updatedBy: userId
        },
        phones: getPhonesInitial(userId),
        emails: getEmailsInitial(userId),
        attributes: attributesInitial,
        createdBy: userId,
        updatedBy: userId
    };
};

export const getCustomerIndDefaultFormValues = (
    accountId: string,
    userId: string,
    countryId: string,
    localIdentifierNameId: string
): TCustomerIndForm => {
    return {
        ...getProviderIndDefaultFormValues(accountId, userId, countryId, localIdentifierNameId),
        code: '',
        customerId: '',
        accountRelation: AccountRelationEnum.customer
    };
};

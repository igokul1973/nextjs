import {
    attributesInitial,
    getEmailsInitial,
    getPhonesInitial
} from '@/app/[locale]/dashboard/customers/utils';
import { AccountRelationEnum } from '@prisma/client';
import { TCustomerOrgForm, TProviderOrgForm } from './form/types';

export const getProviderOrgDefaultFormValues = (
    accountId: string,
    userId: string,
    countryId: string,
    localIdentifierNameId: string
): TProviderOrgForm => {
    return {
        id: '',
        accountRelation: AccountRelationEnum.provider,
        accountId: accountId,
        logo: null,
        name: '',
        localIdentifierNameId,
        localIdentifierValue: '',
        typeId: '',
        description: '',
        isPrivate: true,
        isCharity: false,
        address: {
            addressLine1: '',
            addressLine2: '',
            addressLine3: '',
            locality: '',
            region: '',
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

export const getCustomerOrgDefaultFormValues = (
    accountId: string,
    userId: string,
    countryId: string,
    localIdentifierNameId: string
): TCustomerOrgForm => {
    return {
        ...getProviderOrgDefaultFormValues(accountId, userId, countryId, localIdentifierNameId),
        customerId: '',
        accountRelation: AccountRelationEnum.customer,
        code: ''
    };
};

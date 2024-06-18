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
    userAccountCountryId: string,
    localIdentifierNameId: string
): TProviderIndForm => {
    return {
        id: '',
        code: '',
        accountRelation: AccountRelationEnum.customer,
        accountId: accountId,
        logo: null,
        firstName: '',
        lastName: '',
        middleName: '',
        localIdentifierNameId: localIdentifierNameId,
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
            countryId: userAccountCountryId,
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
    userAccountCountryId: string,
    localIdentifierNameId: string
): TCustomerIndForm => {
    return {
        ...getProviderIndDefaultFormValues(
            accountId,
            userId,
            userAccountCountryId,
            localIdentifierNameId
        ),
        customerId: ''
    };
};

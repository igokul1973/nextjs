import {
    attributesInitial,
    getEmailsInitial,
    getPhonesInitial
} from '@/app/[locale]/dashboard/customers/utils';
import { AccountRelationEnum } from '@prisma/client';
import { TIndividualForm } from './form/types';

export const getDefaultFormValues = (
    accountId: string,
    userId: string,
    userAccountCountryId: string,
    localIdentifierNameId: string
): TIndividualForm => {
    return {
        id: '',
        accountRelation: AccountRelationEnum.customer,
        accountId: accountId,
        customerId: '',
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

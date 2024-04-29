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
        firstName: '',
        lastName: '',
        localIdentifierNameId: localIdentifierNameId,
        localIdentifierValue: '',
        dob: null,
        description: '',
        address: {
            id: '',
            addressLine1: '',
            addressLine2: '',
            locality: '',
            region: '',
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

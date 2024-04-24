import {
    attributesInitial,
    getEmailsInitial,
    getPhonesInitial
} from '@/app/[locale]/dashboard/customers/utils';
import { AccountRelationEnum } from '@prisma/client';
import { TOrganizationForm } from './create-form/types';

export const getDefaultFormValues = (
    accountId: string,
    userId: string,
    userAccountCountryId: string,
    localIdentifierNameId: string
): TOrganizationForm => {
    return {
        id: '',
        accountRelation: AccountRelationEnum.customer,
        accountId: accountId,
        name: '',
        localIdentifierNameId: localIdentifierNameId,
        localIdentifierValue: '',
        typeId: '',
        description: '',
        isPrivate: true,
        isCharity: false,
        address: {
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
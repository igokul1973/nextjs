import { AccountRelationEnum } from '@prisma/client';
import { TFetchCustomersPayload } from './data/customers/types';
import {
    TEntities,
    TEntitiesWithNonNullableCustomer,
    TEntity,
    TIndWithNonNullableCustomer,
    TIndividual,
    TIndividualWithRelations,
    TOrgWithNonNullableCustomer,
    TOrganizationWithRelations,
    TUserWithRelations
} from './definitions';

export const formatCurrency = (amount: number) => {
    return (amount / 100).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
    });
};

export const formatDateToLocal = (dateStr: string, locale: string = 'en-US') => {
    const date = new Date(dateStr);
    const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    };
    const formatter = new Intl.DateTimeFormat(locale, options);
    return formatter.format(date);
};

export const generatePagination = (currentPage: number, totalPages: number) => {
    // If the total number of pages is 7 or less,
    // display all pages without any ellipsis.
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // If the current page is among the first 3 pages,
    // show the first 3, an ellipsis, and the last 2 pages.
    if (currentPage <= 3) {
        return [1, 2, 3, '...', totalPages - 1, totalPages];
    }

    // If the current page is among the last 3 pages,
    // show the first 2, an ellipsis, and the last 3 pages.
    if (currentPage >= totalPages - 2) {
        return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
    }

    // If the current page is somewhere in the middle,
    // show the first page, an ellipsis, the current page and its neighbors,
    // another ellipsis, and the last page.
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
};

export function useDebounce<T>(f: (...args: T[]) => unknown, ms: number = 500) {
    let timeout: NodeJS.Timeout | null = null;
    return (...args: T[]) => {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            f(...args);
        }, ms);
    };
}

export function getIndividualFullNameString(individual: TIndividual | TIndividualWithRelations) {
    return `${individual.firstName}${individual.middleName ? ' ' + individual.middleName : ''} ${individual.lastName}`;
}

export function flattenCustomer(rawCustomer: TFetchCustomersPayload) {
    const rawIndividual = { ...rawCustomer.individual };
    const rawOrganization = { ...rawCustomer.organization };
    if (rawIndividual) {
        return {
            id: rawCustomer.id,
            name: `${rawIndividual.firstName}${rawIndividual.middleName ? ' ' + rawIndividual.middleName : ''} ${rawIndividual.lastName}`,
            email:
                rawIndividual.emails && rawIndividual.emails.length
                    ? rawIndividual.emails[0].email
                    : 'no email provided'
        };
    }
    return {
        id: rawCustomer.id,
        name: rawOrganization.name ?? '',
        email:
            rawOrganization.emails && rawOrganization.emails.length
                ? rawOrganization.emails[0].email
                : 'no email provided'
    };
}

export function getUserProvider(user: TUserWithRelations): TEntities {
    const individualProvider = user.account.individuals?.find(
        (ind) => ind.accountRelation === AccountRelationEnum.provider
    );
    if (individualProvider) {
        return { individual: individualProvider };
    }
    const organizationProvider = user.account.organizations?.find(
        (org) => org.accountRelation === AccountRelationEnum.provider
    );
    // TODO: Questionable return of error. What should it return?
    if (!organizationProvider) {
        throw Error('User account provider is not found.');
    }
    return { organization: organizationProvider };
}

const isIndHasCustomer = (o: TIndividualWithRelations): o is TIndWithNonNullableCustomer => {
    return !!o.customer;
};

const isOrgHasCustomer = (o: TOrganizationWithRelations): o is TOrgWithNonNullableCustomer => {
    return !!o.customer;
};

export function getUserCustomersPerEntity(
    user: TUserWithRelations
): TEntitiesWithNonNullableCustomer {
    const indCustomers = user.account.individuals.filter(isIndHasCustomer);
    const orgCustomers = user.account.organizations.filter(isOrgHasCustomer);

    return { indCustomers, orgCustomers };
}

export const getEntityName = (entity: TEntity) => {
    let name = entity.name;
    if (!name && entity.firstName && entity.lastName) {
        const individual = entity as TIndividual;
        name = getIndividualFullNameString(individual);
    }
    return name;
};

export const getEntityFirstEmailString = (entity: TEntity) => {
    const email = entity?.emails[0].email;
    if (!email) {
        throw Error('The provider does not have associated email. Please seed one first.');
    }
    return email;
};

export const getEntityFirstPhoneString = (entity: TEntity) => {
    const countryCode = entity?.phones[0].countryCode;
    if (!countryCode) {
        throw Error('The provider does not have associated country code. Please seed one first.');
    }
    const phoneNumber = entity?.phones[0].number;
    if (!phoneNumber) {
        throw Error('The provider does not have associated phone number. Please seed one first.');
    }
    return `+${countryCode}-${phoneNumber}`;
};

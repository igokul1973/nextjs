import { AccountRelationEnum } from '@prisma/client';
import { TGetCustomersPayload } from './data/customers/types';
import { TGetUserPayload } from './data/users/types';
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

export function getIndividualFullNameString(
    individual: Pick<TIndividual, 'firstName' | 'middleName' | 'lastName'>
) {
    return `${individual.firstName}${individual.middleName ? ' ' + individual.middleName : ''} ${individual.lastName}`;
}

type TFlattenedCustomer = {
    id: string;
    name: string;
    email: string;
};

export function flattenCustomer(rawCustomer: TGetCustomersPayload): TFlattenedCustomer {
    const entity = rawCustomer.individual || rawCustomer.organization;
    // const org = rawCustomer.organization;
    if (!entity) {
        throw Error('The customer organization or individual is not found. Please add one first.');
    }

    const name =
        'firstName' in entity
            ? getIndividualFullNameString(entity as unknown as TIndividual)
            : entity.name;

    return {
        id: rawCustomer.id,
        name,
        email: entity.emails && entity.emails.length ? entity.emails[0].email : 'no email provided'
    };
}

type TT = {
    individual?: TGetUserPayload['account']['individuals'][0];
    organization?: TGetUserPayload['account']['organizations'][0];
};

export function getUserProvider2(user: TGetUserPayload): TT {
    console.log(user);

    return (
        { individual: user.account.individuals[0] } || {
            organization: user.account.organizations[0]
        }
    );
}

export function getUserProvider<I = TIndividualWithRelations, O = TOrganizationWithRelations>(
    user: TGetUserPayload | TUserWithRelations
): TEntities<I, O> {
    // export function getUserProvider(user: TUserWithRelations): TEntities {
    const individualProvider = user.account.individuals?.find(
        (ind) => ind.accountRelation === AccountRelationEnum.provider
    );
    if (individualProvider) {
        return { individual: individualProvider } as TEntities<I, O>;
    }
    const organizationProvider = user.account.organizations?.find(
        (org) => org.accountRelation === AccountRelationEnum.provider
    );
    // TODO: Questionable return of error. What should it return?
    if (!organizationProvider) {
        throw Error('User account provider is not found.');
    }
    return { organization: organizationProvider } as TEntities<I, O>;
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

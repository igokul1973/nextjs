import { AccountRelationEnum, EntitiesEnum } from '@prisma/client';
import { TGetCustomerPayload } from './data/customer/types';
import { TGetUserPayload } from './data/user/types';
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
} from './types';

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
): string {
    return `${individual.firstName}${individual.middleName ? ' ' + individual.middleName : ''} ${individual.lastName}`;
}

export function getProviderName(
    provider?: TEntities<
        TGetUserPayload['account']['individuals'][number],
        TGetUserPayload['account']['organizations'][number]
    >
): string {
    if (!provider) {
        return 'No provider name';
    }
    if (provider.organization) {
        return provider.organization.name;
    } else if (provider.individual) {
        return getIndividualFullNameString(provider.individual);
    }
    return 'No provider name';
}

export type TFlattenedCustomer = {
    id: string;
    type: EntitiesEnum;
    name: string;
    email: string;
    phone: string;
};

export function flattenCustomer(rawCustomer: TGetCustomerPayload): TFlattenedCustomer {
    const entity = rawCustomer.individual || rawCustomer.organization;
    // const org = rawCustomer.organization;
    if (!entity) {
        throw Error('The customer organization or individual is not found. Please add one first.');
    }

    const name =
        'firstName' in entity
            ? getIndividualFullNameString(entity as unknown as TIndividual)
            : entity.name;

    const type = 'firstName' in entity ? EntitiesEnum.individual : EntitiesEnum.organization;

    return {
        id: rawCustomer.id,
        type,
        name,
        email: entity.emails && entity.emails.length ? entity.emails[0].email : 'no email provided',
        phone:
            entity.phones && entity.phones.length
                ? `+${entity.phones[0].countryCode}-${entity.phones[0].number}`
                : 'no phone provided'
    };
}

/**
 * Generates the user provider based on the input user payload.
 *
 * NOTE: Returning undefined if no provider is found.
 * Should work fornew users who cannot
 * have a provider until they add one.
 *
 * @param {TGetUserPayload | TUserWithRelations} user - The user payload or user with relations object.
 * @return {TEntities<I, O> | undefined} The individual or organization provider entity, or undefined if no provider is found.
 */
export function getUserProvider<I = TIndividualWithRelations, O = TOrganizationWithRelations>(
    user: TGetUserPayload | TUserWithRelations
): TEntities<I, O> | undefined {
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
    return organizationProvider
        ? ({ organization: organizationProvider } as TEntities<I, O>)
        : undefined;
}

export function getUserProviderType(
    provider:
        | TEntities<
              TGetUserPayload['account']['individuals'][0],
              TGetUserPayload['account']['organizations'][0]
          >
        | undefined
) {
    if (!provider) return undefined;

    return provider.individual
        ? EntitiesEnum.individual
        : provider.organization
          ? EntitiesEnum.organization
          : undefined;
}

const isIndHasCustomer = (o: TIndividualWithRelations): o is TIndWithNonNullableCustomer => {
    return !!o.customer;
};

const isOrgHasCustomer = (o: TOrganizationWithRelations): o is TOrgWithNonNullableCustomer => {
    return !!o.customer;
};

/**
 * Generate a list of individual and organization customers associated
 * with a user's account and return them as an object with corresponding
 * lists.
 *
 * @param {TUserWithRelations} user - The user object with relations.
 * @return {TEntitiesWithNonNullableCustomer} An object containing lists of individual and organization customers.
 */
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

export const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

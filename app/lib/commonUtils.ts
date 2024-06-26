import { AccountRelationEnum } from '@prisma/client';
import { TCustomerPayload } from './data/customer/types';
import {
    TGetUserWithRelationsAndInventoryPayload,
    TGetUserWithRelationsPayload
} from './data/user/types';
import {
    TEntities,
    TEntitiesWithNonNullableCustomer,
    TEntity,
    TIndWithNonNullableCustomer,
    TIndividual,
    TOrgWithNonNullableCustomer
} from './types';

export function getIndividualFullNameString(
    individual: Pick<TIndividual, 'firstName' | 'middleName' | 'lastName'>
): string {
    return `${individual.firstName}${individual.middleName ? ' ' + individual.middleName : ''} ${individual.lastName}`;
}

export const isIndHasCustomer = (
    o: TCustomerPayload['individual']
): o is TIndWithNonNullableCustomer => {
    return !!o?.customer;
};

export const isOrgHasCustomer = (
    o: TCustomerPayload['organization']
): o is TOrgWithNonNullableCustomer => {
    return !!o?.customer;
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

export const getEntityName = (entity: TEntity) => {
    let name = entity.name;
    if (!name && entity.firstName && entity.lastName) {
        const individual = entity as TIndividual;
        name = getIndividualFullNameString(individual);
    }
    return name;
};

export function getProviderName(provider?: TEntity | null): string {
    if (!provider) {
        return 'No provider name';
    }
    if ('name' in provider && provider.name) {
        return provider.name;
    } else if ('firstName' in provider && provider.firstName) {
        return getIndividualFullNameString(provider as TIndividual);
    }
    return 'No provider name';
}

/**
 * Generate a list of individual and organization customers associated
 * with a user's account and return them as an object with corresponding
 * lists.
 *
 * @param {TUserWithRelations} user - The user object with relations.
 * @return {TEntitiesWithNonNullableCustomer} An object containing lists of individual and organization customers.
 */
export function getUserCustomersPerEntity(
    user: TGetUserWithRelationsAndInventoryPayload
): TEntitiesWithNonNullableCustomer {
    const indCustomers = user.account.individuals.filter(isIndHasCustomer);
    const orgCustomers = user.account.organizations.filter(isOrgHasCustomer);

    return { indCustomers, orgCustomers };
}

/**
 * Finds user provider based on the input user.
 * Returning undefined if no user or provider exist.
 *
 * @param {TGetUserWithRelationsPayload | TUserWithRelations} user - The user payload or user with relations object.
 * @return {TEntities<I, O> | undefined} The individual or organization provider entity, or undefined if no user or provider exist.
 */
export function getUserProvider<
    I = TGetUserWithRelationsPayload['account']['individuals'][number],
    O = TGetUserWithRelationsPayload['account']['organizations'][number]
>(user: TGetUserWithRelationsPayload): TEntities<I, O> | undefined {
    if (!user) {
        return undefined;
    }
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

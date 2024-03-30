// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.

import type {
    account as TAccount,
    address as TAddress,
    country as TCountry,
    customer as TCustomer,
    individual as TIndividual,
    individualEmail as TIndividualEmail,
    individualPhone as TIndividualPhone,
    inventory as TInventory,
    organization as TOrganization,
    organizationEmail as TOrganizationEmail,
    organizationPhone as TOrganizationPhone,
    profile as TProfile,
    user as TUser
} from '@prisma/client';

export {
    TAccount,
    TAddress,
    TCountry,
    TCustomer,
    TIndividual,
    TIndividualEmail,
    TIndividualPhone,
    TInventory,
    TOrganization,
    TOrganizationEmail,
    TOrganizationPhone,
    TProfile,
    TUser
};

export type TOrganizationWithRelations = TOrganization & {
    address: TAddress & {
        country: TCountry;
    };
    customer: TCustomer | null;
    phones: TOrganizationPhone[];
    emails: TOrganizationEmail[];
};

export type TIndividualWithRelations = TIndividual & {
    address: TAddress & {
        country: TCountry;
    };
    customer: TCustomer | null;
    phones: TIndividualPhone[];
    emails: TIndividualEmail[];
};

export type TUserWithRelations = TUser & {
    account: TAccount & {
        organizations: TOrganizationWithRelations[];
        individuals: TIndividualWithRelations[];
        inventory: TInventory[];
    };
};

export type TEntityPropsDiff = {
    // Organization-related properties
    name?: string;
    typeId?: string;
    isPrivate?: boolean;
    isCharity?: boolean;
    // Individual-related properties
    firstName?: string;
    lastName?: string;
    middleName?: string;
    dob?: string;
};

export type TEntity = (TOrganizationWithRelations | TIndividualWithRelations) & TEntityPropsDiff;

export type TEntities = {
    individual?: TIndividualWithRelations;
    organization?: TOrganizationWithRelations;
};

export type TEntityWithNonNullableCustomer = (
    | TIndWithNonNullableCustomer
    | TOrgWithNonNullableCustomer
) &
    TEntityPropsDiff;

export type TIndWithNonNullableCustomer = Omit<TIndividualWithRelations, 'customer'> & {
    customer: TCustomer;
};

export type TOrgWithNonNullableCustomer = Omit<TOrganizationWithRelations, 'customer'> & {
    customer: TCustomer;
};

export type TEntitiesWithNonNullableCustomer = {
    indCustomers: TIndWithNonNullableCustomer[];
    orgCustomers: TOrgWithNonNullableCustomer[];
};

export interface ISearchParams {
    query?: string;
    page?: string;
}

// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.

export type TOrder = 'asc' | 'desc';

export type TDirtyFields<T> = {
    [K in keyof T]?: T[K] extends Record<string, unknown>
        ? TDirtyFields<T[K]>
        : T[K] extends Array<Record<string, unknown>>
          ? TDirtyFields<T[K][number]>[]
          : boolean | undefined;
};

import { OverridableComponent } from '@mui/material/OverridableComponent';
import { SvgIconTypeMap } from '@mui/material/SvgIcon';
import type {
    account as TAccount,
    address as TAddress,
    country as TCountry,
    customer as TCustomer,
    individual as TIndividual,
    individualEmail as TIndividualEmail,
    individualPhone as TIndividualPhone,
    inventory as TInventory,
    invoice as TInvoice,
    localIdentifierName as TLocalIdentifierName,
    organization as TOrganization,
    organizationEmail as TOrganizationEmail,
    organizationPhone as TOrganizationPhone,
    organizationType as TOrganizationType,
    profile as TProfile,
    user as TUser
} from '@prisma/client';
import { TGetCustomerPayload } from './data/customer/types';

export {
    TAccount,
    TAddress,
    TCountry,
    TCustomer,
    TIndividual,
    TIndividualEmail,
    TIndividualPhone,
    TInventory,
    TInvoice,
    TLocalIdentifierName,
    TOrganization,
    TOrganizationEmail,
    TOrganizationPhone,
    TOrganizationType,
    TProfile,
    TUser
};

export type TMuiIcon = OverridableComponent<SvgIconTypeMap<object, 'svg'>> & {
    muiName: string;
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

export type TEntity = (TGetCustomerPayload['organization'] | TGetCustomerPayload['individual']) &
    TEntityPropsDiff;

export type TEntities<I, O> = {
    individual?: I;
    organization?: O;
};

export type TEntityWithNonNullableCustomer = (
    | TIndWithNonNullableCustomer
    | TOrgWithNonNullableCustomer
) &
    TEntityPropsDiff;

export type TIndWithNonNullableCustomer = Omit<
    Exclude<TGetCustomerPayload['individual'], null>,
    'customer'
> & {
    customer: TCustomer;
};

export type TOrgWithNonNullableCustomer = Omit<
    Exclude<TGetCustomerPayload['organization'], null>,
    'customer'
> & {
    customer: TCustomer;
};

export type TEntitiesWithNonNullableCustomer = {
    indCustomers: TIndWithNonNullableCustomer[];
    orgCustomers: TOrgWithNonNullableCustomer[];
};

export interface ISearchParams {
    query?: string;
    page?: string;
    itemsPerPage?: string;
}
